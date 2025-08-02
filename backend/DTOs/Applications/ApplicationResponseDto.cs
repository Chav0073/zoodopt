namespace backend.DTOs.Applications
{
    public class ApplicationResponseDto
    {
        public int Id { get; set; }
        public int PetId { get; set; }
        public int UserId { get; set; }
        public string? Message { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }

        // Optional: add pet/user summary info (not full objects!)
        public string? PetName { get; set; }
    }
}
