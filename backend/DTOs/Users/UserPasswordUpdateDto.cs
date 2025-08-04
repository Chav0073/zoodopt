using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Users
{
    public class UserPasswordUpdateDto
    {
        [Required]
        [StringLength(100, MinimumLength = 8)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$",
            ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, and one digit")]
        public string NewPassword { get; set; } = string.Empty;
    }
}
