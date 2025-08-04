using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Users
{
    public class UserUpdateDto
    {
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty;

        public int? ShelterId { get; set; }
    }
}
