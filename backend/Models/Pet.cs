using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Pet
    {
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Type { get; set; } // e.g., Dog, Cat

        [Required]
        public required string AgeGroup { get; set; } // e.g., Puppy, Adult

        public string? Description { get; set; }
        public string? ImageFileName { get; set; }

        public int ShelterId { get; set; }
        public required Shelter Shelter { get; set; }

        public List<AdoptionApplication>? Applications { get; set; }
    }
}
