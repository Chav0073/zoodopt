using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty; // Public, ShelterStaff, Admin

        public int? ShelterId { get; set; }
        public Shelter? Shelter { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<AdoptionApplication>? Applications { get; set; }
    }
}
