using backend.Data;
using backend.Models;
using backend.DTOs.Pets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("pets")]
public class PetsController : BaseController
{
    public PetsController(ApplicationDbContext context) : base(context)
    {
    }

    // Helper to shape output
    private static PetResponseDto ToDto(Pet pet)
    {
        return new PetResponseDto
        {
            Id = pet.Id,
            Name = pet.Name,
            Type = pet.Type,
            AgeGroup = pet.AgeGroup,
            Description = pet.Description,
            ImageFileName = pet.ImageFileName,
            ShelterId = pet.ShelterId,
            ShelterName = pet.Shelter?.Name
        };
    }

    // GET /pets
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? type = null, [FromQuery] string? ageGroup = null, [FromQuery] int? shelterId = null)
    {
        IQueryable<Pet> query = _context.Pets.Include(p => p.Shelter);

        if (!string.IsNullOrEmpty(type))
            query = query.Where(p => p.Type.ToLower().Contains(type.ToLower()));

        if (!string.IsNullOrEmpty(ageGroup))
            query = query.Where(p => p.AgeGroup.ToLower().Contains(ageGroup.ToLower()));

        if (shelterId.HasValue)
            query = query.Where(p => p.ShelterId == shelterId.Value);

        var pets = await query.ToListAsync();
        return Ok(pets.Select(ToDto));
    }

    // GET /pets/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var pet = await _context.Pets
            .Include(p => p.Shelter)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pet == null)
            return StandardError(404, "Pet not found.");

        return Ok(ToDto(pet));
    }

    // POST /pets
    [Authorize(Roles = UserRoles.ShelterStaff + "," + UserRoles.Admin)]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PetCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await GetCurrentUserAsync();
        if (user == null)
            return StandardError(401, "User not authenticated.");

        // Verify shelter exists
        var shelter = await _context.Shelters.FindAsync(dto.ShelterId);
        if (shelter == null)
            return StandardError(400, "Shelter does not exist.");

        // Check authorization
        if (!CanManagePet(user, dto.ShelterId))
            return StandardError(403, "You are not allowed to create pets for this shelter.");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var pet = new Pet
            {
                Name = dto.Name,
                Type = dto.Type,
                AgeGroup = dto.AgeGroup,
                Description = dto.Description,
                ImageFileName = dto.ImageFileName,
                ShelterId = dto.ShelterId,
                Shelter = shelter
            };

            _context.Pets.Add(pet);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
            return CreatedAtAction(nameof(Get), new { id = pet.Id }, ToDto(pet));
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // PUT /pets/{id}
    [Authorize(Roles = UserRoles.ShelterStaff + "," + UserRoles.Admin)]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] PetUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await GetCurrentUserAsync();
        if (user == null)
            return StandardError(401, "User not authenticated.");

        var pet = await _context.Pets
            .Include(p => p.Shelter)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pet == null)
            return StandardError(404, "Pet not found.");

        if (!CanManagePet(user, pet.ShelterId))
            return StandardError(403, "You are not allowed to update this pet.");

        pet.Name = dto.Name;
        pet.Type = dto.Type;
        pet.AgeGroup = dto.AgeGroup;
        pet.Description = dto.Description;
        pet.ImageFileName = dto.ImageFileName;

        await _context.SaveChangesAsync();
        return Ok(ToDto(pet));
    }

    // DELETE /pets/{id}
    [Authorize(Roles = UserRoles.ShelterStaff + "," + UserRoles.Admin)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return StandardError(401, "User not authenticated.");

        var pet = await _context.Pets.FindAsync(id);
        if (pet == null)
            return StandardError(404, "Pet not found.");

        if (!CanManagePet(user, pet.ShelterId))
            return StandardError(403, "You are not allowed to delete this pet.");

        // Check for existing applications
        var hasApplications = await _context.Applications.AnyAsync(a => a.PetId == id);
        if (hasApplications)
            return StandardError(400, "Cannot delete pet with existing applications.");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            _context.Pets.Remove(pet);
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
