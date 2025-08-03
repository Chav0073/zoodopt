using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Shelters
{
    public class ShelterUpdateDto
    {
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Name { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Location { get; set; }

        [StringLength(20)]
        public string? Phone { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }

        [StringLength(200)]
        public string? Logo { get; set; }
    }
}
