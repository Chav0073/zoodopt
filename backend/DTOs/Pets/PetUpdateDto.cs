using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Pets
{
    public class PetUpdateDto
    {
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string AgeGroup { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [StringLength(255)]
        public string? ImageFileName { get; set; }
    }
}
