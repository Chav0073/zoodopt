namespace backend.DTOs.Shelters
{
    public class ShelterResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Location { get; set; }
        public int PetCount { get; set; }
    }
}
