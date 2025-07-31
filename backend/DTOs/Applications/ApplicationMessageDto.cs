using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Applications
{
    public class ApplicationMessageDto
    {
        [Required]
        public string Message { get; set; } = string.Empty;
    }
}
