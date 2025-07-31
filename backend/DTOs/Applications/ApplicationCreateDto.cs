using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Applications
{
    public class ApplicationCreateDto
    {
        [Required]
        public int PetId { get; set; }
        public string? Message { get; set; }
    }
}
