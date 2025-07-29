using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace backend.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        var passwordHasher = new PasswordHasher<User>();
        await context.Database.MigrateAsync();

        if (!context.Users.Any())
        {
            // Create shelter
            var shelters = new List<Shelter>
            {
                new() { Name = "Happy Tails", Location = "Downtown" },
                new() { Name = "Paws Haven", Location = "Uptown" },
                new() { Name = "Safe Harbor", Location = "Suburb" }
            };
            context.Shelters.AddRange(shelters);
            await context.SaveChangesAsync();

            // Create admin user
            var admin = new User
            {
                Email = "admin@example.com",
                Role = "Admin",
            };
            admin.PasswordHash = passwordHasher.HashPassword(admin, "Password123!");


            // Create shelter staff user
            var shelterUser = new User
            {
                Email = "shelter@example.com",
                Role = "ShelterStaff",
                ShelterId = shelters[0].Id
            };
            shelterUser.PasswordHash = passwordHasher.HashPassword(shelterUser, "Password123!");

            // Create public user
            var publicUser = new User
            {
                Email = "user@example.com",
                Role = "Public"
            };
            publicUser.PasswordHash = passwordHasher.HashPassword(publicUser, "Password123!");

            context.Users.AddRange(shelterUser, publicUser, admin);
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
                    ShelterId = shelters[0].Id,
                    Shelter = shelters[0]
                },
                new Pet
                {
                    Name = "Whiskers",
                    Type = "Cat",
                    AgeGroup = "Kitten",
                    Description = "Playful tabby kitten",
                    ImageFileName = "whiskers.jpg",
                    ShelterId = shelters[1].Id,
                    Shelter = shelters[1]
                },
                new Pet
                {
                    Name = "Buddy",
                    Type = "Dog",
                    AgeGroup = "Puppy",
                    Description = "Energetic golden retriever puppy",
                    ImageFileName = "buddy.jpg",
                    ShelterId = shelters[2].Id,
                    Shelter = shelters[2]
                }
            };

            context.Pets.AddRange(pets);
            await context.SaveChangesAsync();
        }
    }
}
