using backend.Data;
using backend.DTOs.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("users")]
public class UsersController : BaseController
{
    public UsersController(ApplicationDbContext context) : base(context)
    {
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetProfile()
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return StandardError(401, "User not authenticated.");

        // Include shelter information if user is shelter staff
        var userWithShelter = await _context.Users
            .Include(u => u.Shelter)
            .FirstOrDefaultAsync(u => u.Id == user.Id);

        var profile = new UserProfileDto
        {
            Id = userWithShelter!.Id,
            Email = userWithShelter.Email,
            Role = userWithShelter.Role,
            ShelterId = userWithShelter.ShelterId,
            ShelterName = userWithShelter.Shelter?.Name
        };

        return Ok(profile);
    }
}
