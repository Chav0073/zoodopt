using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Applications
{
    public class ApplicationStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
