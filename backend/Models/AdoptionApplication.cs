using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class AdoptionApplication
    {
        public int Id { get; set; }

        [Required]
        public int PetId { get; set; }

        [Required]
        public required Pet Pet { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public required User User { get; set; }

        public string? Message { get; set; }
        public string Status { get; set; } = "Pending";

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}
