using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Shelter
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Location { get; set; }

        public List<Pet>? Pets { get; set; }
        public List<User>? Staff { get; set; } // optional if navigation needed
    }
}
