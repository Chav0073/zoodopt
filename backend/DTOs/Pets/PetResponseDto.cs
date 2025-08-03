namespace backend.DTOs.Pets
{
    public class PetResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string AgeGroup { get; set; } = string.Empty;
        public string? Breed { get; set; }
        public string? Gender { get; set; }
        public string? Status { get; set; }
        public string? Description { get; set; }
        public string? ImageFileName { get; set; }
        public string? ImageUrl { get; set; }
        public int ShelterId { get; set; }
        public string? ShelterName { get; set; }
    }
}
