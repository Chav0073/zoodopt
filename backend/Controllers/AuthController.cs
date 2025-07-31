using backend.Data;
using backend.Models;
using backend.DTOs.Auth;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace backend.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : BaseController
{
    private readonly JwtService _jwt;
    private readonly PasswordHasher<User> _hasher;

    public AuthController(ApplicationDbContext context, JwtService jwt, PasswordHasher<User> hasher) : base(context)
    {
        _jwt = jwt;
        _hasher = hasher;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return StandardError(400, "Email already in use.");

        if (!UserRoles.All.Contains(dto.Role))
            return StandardError(400, "Invalid role.");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var user = new User
            {
                Email = dto.Email,
                Role = dto.Role
            };
            user.PasswordHash = _hasher.HashPassword(user, dto.Password);

            if (dto.Role == UserRoles.ShelterStaff)
            {
                if (dto.ShelterId == null)
                    return StandardError(400, "Shelter selection is required for ShelterStaff registration.");

                var shelter = await _context.Shelters.FindAsync(dto.ShelterId.Value);
                if (shelter == null)
                    return StandardError(400, "Selected shelter does not exist.");

                user.ShelterId = shelter.Id;
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);

            await transaction.CommitAsync();
            return Ok(new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                Role = user.Role
            });
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
            return StandardError(401, "Invalid email or password.");

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
        if (result == PasswordVerificationResult.Failed)
            return StandardError(401, "Invalid email or password.");

        var token = _jwt.GenerateToken(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            Role = user.Role
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // With JWT, "logout" is client-side: remove the token on frontend.
        return Ok(new { message = "Logout successful. Please remove your token from storage.", timestamp = DateTime.UtcNow });
    }
}
