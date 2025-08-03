using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Pet
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty; // e.g., Dog, Cat (maps to species in frontend)

        public string? Breed { get; set; }

        [Required]
        public string AgeGroup { get; set; } = string.Empty; // e.g., Puppy, Adult

        public string? Gender { get; set; }

        public string? Description { get; set; }
        public string? ImageFileName { get; set; } // maps to photo in frontend

        [Required]
        public string Status { get; set; } = "Available"; // Available, Pending, Adopted

        public int ShelterId { get; set; }
        public required Shelter Shelter { get; set; }

        public List<AdoptionApplication>? Applications { get; set; }
    }
}
