namespace backend.DTOs.Users
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int? ShelterId { get; set; }
        public string? ShelterName { get; set; }
    }
}
