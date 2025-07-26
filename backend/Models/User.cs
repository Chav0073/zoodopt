using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public required string Email { get; set; }

        [Required]
        public required string PasswordHash { get; set; }

        [Required]
        public required string Role { get; set; } // Public, ShelterStaff, Admin

        public int? ShelterId { get; set; }
        public Shelter? Shelter { get; set; }

        public List<AdoptionApplication>? Applications { get; set; }
    }
}
