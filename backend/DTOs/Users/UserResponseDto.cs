namespace backend.DTOs.Users
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int? ShelterId { get; set; }
        public string? ShelterName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
