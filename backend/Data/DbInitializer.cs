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
                new() {
                    Name = "Happy Tails Shelter",
                    Location = "Toronto, ON",
                    Phone = "416-555-0101",
                    Email = "contact@happytails.ca",
                    Description = "We specialize in dogs and rabbits. Focused on rehabilitation and rehoming.",
                    Logo = "happytails.png"
                },
                new() {
                    Name = "Paws Haven",
                    Location = "Vancouver, BC",
                    Phone = "604-555-0102",
                    Email = "info@pawshaven.ca",
                    Description = "A safe haven for cats and small animals. Providing medical care and love.",
                    Logo = "pawshaven.png"
                },
                new() {
                    Name = "Safe Harbor Animal Rescue",
                    Location = "Calgary, AB",
                    Phone = "403-555-0103",
                    Email = "rescue@safeharbor.ca",
                    Description = "Full-service animal rescue specializing in emergency and special needs cases.",
                    Logo = "safeharbor.png"
                }
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

            // Create shelter staff users - one for each shelter
            var shelterStaff1 = new User
            {
                Email = "staff@happytails.ca",
                Role = "ShelterStaff",
                ShelterId = shelters[0].Id
            };
            shelterStaff1.PasswordHash = passwordHasher.HashPassword(shelterStaff1, "Password123!");

            var shelterStaff2 = new User
            {
                Email = "staff@pawshaven.ca",
                Role = "ShelterStaff",
                ShelterId = shelters[1].Id
            };
            shelterStaff2.PasswordHash = passwordHasher.HashPassword(shelterStaff2, "Password123!");

            var shelterStaff3 = new User
            {
                Email = "staff@safeharbor.ca",
                Role = "ShelterStaff",
                ShelterId = shelters[2].Id
            };
            shelterStaff3.PasswordHash = passwordHasher.HashPassword(shelterStaff3, "Password123!");

            // Create public user
            var publicUser = new User
            {
                Email = "user@example.com",
                Role = "Public"
            };
            publicUser.PasswordHash = passwordHasher.HashPassword(publicUser, "Password123!");

            context.Users.AddRange(admin, shelterStaff1, shelterStaff2, shelterStaff3, publicUser);
            await context.SaveChangesAsync();

            // Create pets under shelter
            var pets = new List<Pet>
            {
                new Pet
                {
                    Name = "Bella",
                    Type = "Dog",
                    Breed = "Labrador Retriever",
                    AgeGroup = "Adult",
                    Gender = "Female",
                    Description = "Friendly and energetic, loves to play fetch and swim. Great with kids!",
                    ImageFileName = "bella.jpg",
                    Status = "Available",
                    ShelterId = shelters[0].Id,
                    Shelter = shelters[0]
                },
                new Pet
                {
                    Name = "Whiskers",
                    Type = "Cat",
                    Breed = "Tabby",
                    AgeGroup = "Kitten",
                    Gender = "Male",
                    Description = "Playful tabby kitten who loves toys and cuddles. Perfect for families.",
                    ImageFileName = "whiskers.jpg",
                    Status = "Available",
                    ShelterId = shelters[1].Id,
                    Shelter = shelters[1]
                },
                new Pet
                {
                    Name = "Buddy",
                    Type = "Dog",
                    Breed = "Golden Retriever",
                    AgeGroup = "Puppy",
                    Gender = "Male",
                    Description = "Energetic golden retriever puppy with a heart of gold. Loves everyone!",
                    ImageFileName = "buddy.jpg",
                    Status = "Available",
                    ShelterId = shelters[2].Id,
                    Shelter = shelters[2]
                },
                new Pet
                {
                    Name = "Luna",
                    Type = "Cat",
                    Breed = "Persian",
                    AgeGroup = "Adult",
                    Gender = "Female",
                    Description = "Calm and elegant Persian cat. Enjoys quiet environments and gentle pets.",
                    ImageFileName = "luna.jpg",
                    Status = "Pending",
                    ShelterId = shelters[1].Id,
                    Shelter = shelters[1]
                },
                new Pet
                {
                    Name = "Charlie",
                    Type = "Dog",
                    Breed = "Beagle",
                    AgeGroup = "Senior",
                    Gender = "Male",
                    Description = "Sweet senior beagle looking for a quiet retirement home. Very gentle.",
                    ImageFileName = "charlie.jpg",
                    Status = "Available",
                    ShelterId = shelters[0].Id,
                    Shelter = shelters[0]
                }
            };

            context.Pets.AddRange(pets);
            await context.SaveChangesAsync();
        }
    }
}
