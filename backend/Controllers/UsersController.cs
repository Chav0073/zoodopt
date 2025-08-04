using backend.Data;
using backend.Models;
using backend.DTOs.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace backend.Controllers;

[ApiController]
[Route("users")]
public class UsersController : BaseController
{
    private readonly PasswordHasher<User> _hasher;

    public UsersController(ApplicationDbContext context, PasswordHasher<User> hasher) : base(context)
    {
        _hasher = hasher;
    }

    // Helper to shape output
    private static UserResponseDto ToDto(User user)
    {
        return new UserResponseDto
        {
            Id = user.Id,
            Email = user.Email,
            Role = user.Role,
            ShelterId = user.ShelterId,
            ShelterName = user.Shelter?.Name,
            CreatedAt = user.CreatedAt
        };
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

    // GET /users - Get all users (admin only)
    [Authorize(Roles = UserRoles.Admin)]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users
            .Include(u => u.Shelter)
            .OrderBy(u => u.CreatedAt)
            .ToListAsync();

        return Ok(users.Select(ToDto));
    }

    // GET /users/{id} - Get specific user (admin only)
    [Authorize(Roles = UserRoles.Admin)]
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var user = await _context.Users
            .Include(u => u.Shelter)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return StandardError(404, "User not found.");

        return Ok(ToDto(user));
    }

    // PUT /users/{id} - Update user details (admin only)
    [Authorize(Roles = UserRoles.Admin)]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UserUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _context.Users
            .Include(u => u.Shelter)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return StandardError(404, "User not found.");

        // Validate role
        if (!UserRoles.All.Contains(dto.Role))
            return StandardError(400, "Invalid role.");

        // Check for duplicate email (excluding current user)
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower() && u.Id != id);
        if (existingUser != null)
            return StandardError(409, "Email already in use by another user.");

        // Validate shelter for ShelterStaff role
        if (dto.Role == UserRoles.ShelterStaff)
        {
            if (dto.ShelterId == null)
                return StandardError(400, "Shelter selection is required for ShelterStaff role.");

            var shelter = await _context.Shelters.FindAsync(dto.ShelterId.Value);
            if (shelter == null)
                return StandardError(400, "Selected shelter does not exist.");
        }
        else
        {
            // Clear shelterId for non-staff roles
            dto.ShelterId = null;
        }

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            user.Email = dto.Email;
            user.Role = dto.Role;
            user.ShelterId = dto.ShelterId;

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            // Reload user with shelter data
            await _context.Entry(user).Reference(u => u.Shelter).LoadAsync();

            return Ok(ToDto(user));
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // PUT /users/{id}/password - Update user password (admin only)
    [Authorize(Roles = UserRoles.Admin)]
    [HttpPut("{id}/password")]
    public async Task<IActionResult> UpdatePassword(int id, [FromBody] UserPasswordUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return StandardError(404, "User not found.");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            user.PasswordHash = _hasher.HashPassword(user, dto.NewPassword);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { message = "Password updated successfully.", timestamp = DateTime.UtcNow });
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // DELETE /users/{id} - Delete user (admin only)
    [Authorize(Roles = UserRoles.Admin)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser == null)
            return StandardError(401, "User not authenticated.");

        // Prevent admin from deleting themselves
        if (currentUser.Id == id)
            return StandardError(400, "Cannot delete your own account.");

        var user = await _context.Users
            .Include(u => u.Applications)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return StandardError(404, "User not found.");

        // Check for dependencies
        if (user.Applications?.Any() == true)
            return StandardError(400, "Cannot delete user with existing applications. Please handle applications first.");

        // Check if this is the only admin user
        if (user.Role == UserRoles.Admin)
        {
            var adminCount = await _context.Users.CountAsync(u => u.Role == UserRoles.Admin);
            if (adminCount <= 1)
                return StandardError(400, "Cannot delete the last admin user.");
        }

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            _context.Users.Remove(user);
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

    // GET /users/stats - Get user statistics (admin only)
    [Authorize(Roles = UserRoles.Admin)]
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = new
        {
            totalUsers = await _context.Users.CountAsync(),
            publicUsers = await _context.Users.CountAsync(u => u.Role == UserRoles.Public),
            shelterStaff = await _context.Users.CountAsync(u => u.Role == UserRoles.ShelterStaff),
            adminUsers = await _context.Users.CountAsync(u => u.Role == UserRoles.Admin),
            usersWithApplications = await _context.Users.CountAsync(u => u.Applications != null && u.Applications.Any()),
            recentUsers = await _context.Users.CountAsync(u => u.CreatedAt >= DateTime.UtcNow.AddDays(-7))
        };

        return Ok(stats);
    }
}
