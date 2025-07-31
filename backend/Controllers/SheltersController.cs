using backend.Data;
using backend.Models;
using backend.DTOs.Shelters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("shelters")]
public class SheltersController : BaseController
{
    public SheltersController(ApplicationDbContext context) : base(context)
    {
    }

    // Helper to shape output
    private static ShelterResponseDto ToDto(Shelter shelter)
    {
        return new ShelterResponseDto
        {
            Id = shelter.Id,
            Name = shelter.Name,
            Location = shelter.Location,
            PetCount = shelter.Pets?.Count ?? 0
        };
    }

    // GET /shelters
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var shelters = await _context.Shelters
            .Include(s => s.Pets)
            .ToListAsync();
        return Ok(shelters.Select(ToDto));
    }

    // GET /shelters/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var shelter = await _context.Shelters
            .Include(s => s.Pets)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (shelter == null)
            return StandardError(404, "Shelter not found.");

        return Ok(ToDto(shelter));
    }

    // POST /shelters
    [Authorize(Roles = UserRoles.Admin)]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ShelterCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await GetCurrentUserAsync();
        if (user == null)
            return StandardError(401, "User not authenticated.");

        // Check for duplicate names
        var existingShelter = await _context.Shelters
            .FirstOrDefaultAsync(s => s.Name.ToLower() == dto.Name.ToLower());
        if (existingShelter != null)
            return StandardError(409, "A shelter with this name already exists.");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var shelter = new Shelter
            {
                Name = dto.Name,
                Location = dto.Location
            };

            _context.Shelters.Add(shelter);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
            return CreatedAtAction(nameof(Get), new { id = shelter.Id }, ToDto(shelter));
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // PUT /shelters/{id}
    [Authorize(Roles = UserRoles.Admin)]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ShelterUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await GetCurrentUserAsync();
        if (user == null)
            return StandardError(401, "User not authenticated.");

        var shelter = await _context.Shelters
            .Include(s => s.Pets)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (shelter == null)
            return StandardError(404, "Shelter not found.");

        // Check for duplicate names (excluding current shelter)
        var existingShelter = await _context.Shelters
            .FirstOrDefaultAsync(s => s.Name.ToLower() == dto.Name.ToLower() && s.Id != id);
        if (existingShelter != null)
            return StandardError(409, "A shelter with this name already exists.");

        shelter.Name = dto.Name;
        shelter.Location = dto.Location;

        await _context.SaveChangesAsync();
        return Ok(ToDto(shelter));
    }

    // DELETE /shelters/{id}
    [Authorize(Roles = UserRoles.Admin)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return StandardError(401, "User not authenticated.");

        var shelter = await _context.Shelters
            .Include(s => s.Pets)
            .Include(s => s.Staff)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (shelter == null)
            return StandardError(404, "Shelter not found.");

        // Check for dependencies
        if (shelter.Pets?.Any() == true)
            return StandardError(400, "Cannot delete shelter with existing pets.");

        if (shelter.Staff?.Any() == true)
            return StandardError(400, "Cannot delete shelter with existing staff members.");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            _context.Shelters.Remove(shelter);
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
