using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace backend.DTOs.Pets
{
    public class PetCreateDto
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

        public IFormFile? ImageFile { get; set; }

        [Required]
        public int ShelterId { get; set; }
    }
}
