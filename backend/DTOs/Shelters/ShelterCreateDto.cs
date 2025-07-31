using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Shelters
{
    public class ShelterCreateDto
    {
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Name { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Location { get; set; }
    }
}
