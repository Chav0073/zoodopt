using backend.Data;
using backend.Models;
using backend.DTOs.Applications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("applications")]
public class ApplicationsController : BaseController
{
    public ApplicationsController(ApplicationDbContext context) : base(context)
    {
    }

    // Helper method to check if user can access application
    private bool CanAccessApplication(User user, AdoptionApplication application)
    {
        return user.Role == UserRoles.Admin ||
               (user.Role == UserRoles.ShelterStaff && application.Pet.ShelterId == user.ShelterId) ||
               application.UserId == user.Id;
    }

    // Helper to shape output
    private static ApplicationResponseDto ToDto(AdoptionApplication app)
    {
        return new ApplicationResponseDto
        {
            Id = app.Id,
            PetId = app.PetId,
            UserId = app.UserId,
            Message = app.Message,
            Status = app.Status,
            SubmittedAt = app.SubmittedAt,
            PetName = app.Pet?.Name // null if not included
        };
    }

    // GET /applications
    [Authorize(Roles = UserRoles.ShelterStaff + "," + UserRoles.Admin)]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return StandardError(401, "User not authenticated.");

        IQueryable<AdoptionApplication> query = _context.Applications.Include(a => a.Pet);

        if (user.Role == UserRoles.ShelterStaff)
            query = query.Where(a => a.Pet.ShelterId == user.ShelterId);

        var apps = await query.ToListAsync();
        return Ok(apps.Select(ToDto));
    }

    // GET /applications/my-applications
    [Authorize]
    [HttpGet("my-applications")]
    public async Task<IActionResult> GetMyApplications()
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return StandardError(401, "User not authenticated.");

        var apps = await _context.Applications
            .Include(a => a.Pet)
            .Where(a => a.UserId == user.Id)
            .OrderByDescending(a => a.SubmittedAt)
            .ToListAsync();

        return Ok(apps.Select(ToDto));
    }

    // GET /applications/{id}
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return StandardError(401, "User not authenticated.");

        var app = await _context.Applications
            .Include(a => a.Pet)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (app == null)
            return StandardError(404, "Application not found.");

        if (!CanAccessApplication(user, app))
            return StandardError(403, "You are not allowed to view this application.");

        return Ok(ToDto(app));
    }

    // POST /applications
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ApplicationCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await GetCurrentUserAsync();
        if (user == null)
            return StandardError(401, "User not authenticated.");

        var pet = await _context.Pets.FindAsync(dto.PetId);
        if (pet == null)
            return StandardError(400, "Pet does not exist.");

        // Check for duplicate applications
        var existingApplication = await _context.Applications
            .FirstOrDefaultAsync(a => a.PetId == dto.PetId && a.UserId == user.Id);
        if (existingApplication != null)
            return StandardError(409, "You have already submitted an application for this pet.");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var application = new AdoptionApplication
            {
                PetId = dto.PetId,
                UserId = user.Id,
                Message = dto.Message ?? string.Empty,
                Status = ApplicationStatuses.Pending,
                SubmittedAt = DateTime.UtcNow,
                Pet = pet,
                User = user
            };

            _context.Applications.Add(application);

            // Update pet status to Pending if it's currently Available
            if (pet.Status == "Available")
            {
                pet.Status = "Pending";
            }

            await _context.SaveChangesAsync();

            var created = await _context.Applications
                .Include(a => a.Pet)
                .FirstOrDefaultAsync(a => a.Id == application.Id);

            await transaction.CommitAsync();
            return CreatedAtAction(nameof(Get), new { id = application.Id }, ToDto(created!));
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // PUT /applications/{id}/message
    [Authorize]
    [HttpPut("{id}/message")]
    public async Task<IActionResult> UpdateMessage(int id, [FromBody] ApplicationMessageDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await GetCurrentUserAsync();
        if (user == null)
            return StandardError(401, "User not authenticated.");

        var app = await _context.Applications
            .Include(a => a.Pet)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (app == null)
            return StandardError(404, "Application not found.");

        if (app.UserId != user.Id)
            return StandardError(403, "You are not allowed to update this message.");

        app.Message = dto.Message;
        await _context.SaveChangesAsync();

        return Ok(ToDto(app));
    }

    // PUT /applications/{id}/status
    [Authorize(Roles = UserRoles.ShelterStaff + "," + UserRoles.Admin)]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] ApplicationStatusDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await GetCurrentUserAsync();
        if (user == null)
            return StandardError(401, "User not authenticated.");

        var app = await _context.Applications
            .Include(a => a.Pet)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (app == null)
            return StandardError(404, "Application not found.");

        if (user.Role != UserRoles.Admin &&
            (user.Role != UserRoles.ShelterStaff || app.Pet.ShelterId != user.ShelterId))
            return StandardError(403, "You are not allowed to update this application's status.");

        if (!ApplicationStatuses.All.Contains(dto.Status))
            return StandardError(400, $"Invalid status. Allowed values: {string.Join(", ", ApplicationStatuses.All)}");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            app.Status = dto.Status;

            // If application is approved, update pet status and reject other applications
            if (dto.Status == ApplicationStatuses.Approved)
            {
                // Update pet status to Adopted
                app.Pet.Status = "Adopted";

                // Reject all other pending applications for this pet
                var otherApplications = await _context.Applications
                    .Where(a => a.PetId == app.PetId && a.Id != app.Id && a.Status == ApplicationStatuses.Pending)
                    .ToListAsync();

                foreach (var otherApp in otherApplications)
                {
                    otherApp.Status = ApplicationStatuses.Rejected;
                }
            }
            // If application is rejected and pet is adopted, check if there are other approved applications
            else if (dto.Status == ApplicationStatuses.Rejected && app.Pet.Status == "Adopted")
            {
                // Check if there are any other approved applications for this pet
                var hasOtherApprovedApps = await _context.Applications
                    .AnyAsync(a => a.PetId == app.PetId && a.Id != app.Id && a.Status == ApplicationStatuses.Approved);

                // If no other approved applications, set pet back to available
                if (!hasOtherApprovedApps)
                {
                    app.Pet.Status = "Available";
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(ToDto(app));
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // DELETE /applications/{id}
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return StandardError(401, "User not authenticated.");

        var app = await _context.Applications
            .Include(a => a.Pet)
            .FirstOrDefaultAsync(a => a.Id == id);
        if (app == null)
            return StandardError(404, "Application not found.");

        if (user.Role != UserRoles.Admin && app.UserId != user.Id)
            return StandardError(403, "You are not allowed to delete this application.");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            _context.Applications.Remove(app);

            // Check if this was the last pending application for the pet
            var remainingApplications = await _context.Applications
                .Where(a => a.PetId == app.PetId && a.Id != app.Id)
                .ToListAsync();

            // If no remaining applications and pet is pending, set back to available
            if (!remainingApplications.Any() && app.Pet.Status == "Pending")
            {
                app.Pet.Status = "Available";
            }
            // If no approved applications remain and pet is adopted, set back to available
            else if (!remainingApplications.Any(a => a.Status == ApplicationStatuses.Approved) && app.Pet.Status == "Adopted")
            {
                app.Pet.Status = "Available";
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return NoContent();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
