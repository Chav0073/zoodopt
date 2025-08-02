using System;
using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTOs.Auth;

public class RegisterDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 8)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$")]
    public string Password { get; set; } = string.Empty;

    public string Role { get; set; } = UserRoles.Public;


    // Only for ShelterStaff
    public int? ShelterId { get; set; }
}





