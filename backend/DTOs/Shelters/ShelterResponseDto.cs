namespace backend.DTOs.Shelters
{
    public class ShelterResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Description { get; set; }
        public string? Logo { get; set; }
        public int PetCount { get; set; }
    }
}
