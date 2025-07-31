using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

public abstract class BaseController : ControllerBase
{
    protected readonly ApplicationDbContext _context;

    protected BaseController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Helper method to get current user
    protected async Task<User?> GetCurrentUserAsync()
    {
        var userEmail = User.Identity?.Name;
        if (string.IsNullOrEmpty(userEmail))
            return null;
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
    }

    // Helper method for standardized error responses
    protected IActionResult StandardError(int statusCode, string message)
    {
        return StatusCode(statusCode, new { error = message, timestamp = DateTime.UtcNow });
    }

    // Helper method to check if user can manage pet (for shelter staff)
    protected bool CanManagePet(User user, int petShelterId)
    {
        return user.Role == UserRoles.Admin ||
               (user.Role == UserRoles.ShelterStaff && user.ShelterId == petShelterId);
    }
}
