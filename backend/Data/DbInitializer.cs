using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        await context.Database.MigrateAsync();

        if (!context.Users.Any())
        {
            // Create shelter
            var shelter = new Shelter
            {
                Name = "Happy Tails Shelter",
                Location = "123 Main Street"
            };
            context.Shelters.Add(shelter);
            await context.SaveChangesAsync();

            // Create shelter staff user
            var shelterUser = new User
            {
                Email = "shelter@example.com",
                PasswordHash = "Password123!", // NOTE: no hashing in this version
                Role = "ShelterStaff",
                ShelterId = shelter.Id
            };

            // Create public user
            var publicUser = new User
            {
                Email = "user@example.com",
                PasswordHash = "Password123!", // NOTE: again, no hashing
                Role = "Public"
            };

            context.Users.AddRange(shelterUser, publicUser);
            await context.SaveChangesAsync();

            // Create pets under shelter
            var pets = new List<Pet>
            {
                new Pet
                {
                    Name = "Max",
                    Type = "Dog",
                    AgeGroup = "Adult",
                    Description = "Friendly Labrador",
                    ImageFileName = "max.jpg",
                    ShelterId = shelter.Id,
                    Shelter = shelter
                },
                new Pet
                {
                    Name = "Whiskers",
                    Type = "Cat",
                    AgeGroup = "Kitten",
                    Description = "Playful tabby kitten",
                    ImageFileName = "whiskers.jpg",
                    ShelterId = shelter.Id,
                    Shelter = shelter
                }
            };

            context.Pets.AddRange(pets);
            await context.SaveChangesAsync();
        }
    }
}
