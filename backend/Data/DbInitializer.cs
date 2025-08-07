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
                    Logo = "shelters/happy-tails-shelter.jpg"
                },
                new() {
                    Name = "Paws Haven",
                    Location = "Vancouver, BC",
                    Phone = "604-555-0102",
                    Email = "info@pawshaven.ca",
                    Description = "A safe haven for cats and small animals. Providing medical care and love.",
                    Logo = "shelters/paws-haven.jpg"
                },
                new() {
                    Name = "Safe Harbor Animal Rescue",
                    Location = "Calgary, AB",
                    Phone = "403-555-0103",
                    Email = "rescue@safeharbor.ca",
                    Description = "Full-service animal rescue specializing in emergency and special needs cases.",
                    Logo = "shelters/safe-harbor-animal-rescue.jpg"
                },
                new() {
                    Name = "Furry Friends Foundation",
                    Location = "Montreal, QC",
                    Phone = "514-555-0104",
                    Email = "help@furryfriends.ca",
                    Description = "Dedicated to rescuing and rehoming cats, dogs, and exotic pets across Quebec.",
                    Logo = "shelters/furry-friends-foundation.jpg"
                },
                new() {
                    Name = "Compassionate Care Animal Shelter",
                    Location = "Halifax, NS",
                    Phone = "902-555-0105",
                    Email = "care@compassionatecare.ca",
                    Description = "Providing comprehensive veterinary care and adoption services for all animals.",
                    Logo = "shelters/compassionate-care-animal-shelter.jpg"
                },
                new() {
                    Name = "Second Chance Pet Rescue",
                    Location = "Winnipeg, MB",
                    Phone = "204-555-0106",
                    Email = "info@secondchance.ca",
                    Description = "Giving senior and special needs animals a second chance at finding loving homes.",
                    Logo = "shelters/second-chance-pet-rescue.jpg"
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

            var shelterStaff4 = new User
            {
                Email = "help@furryfriends.ca",
                Role = "ShelterStaff",
                ShelterId = shelters[3].Id
            };
            shelterStaff4.PasswordHash = passwordHasher.HashPassword(shelterStaff4, "Password123!");

            var shelterStaff5 = new User
            {
                Email = "care@compassionatecare.ca",
                Role = "ShelterStaff",
                ShelterId = shelters[4].Id
            };
            shelterStaff5.PasswordHash = passwordHasher.HashPassword(shelterStaff5, "Password123!");

            var shelterStaff6 = new User
            {
                Email = "info@secondchance.ca",
                Role = "ShelterStaff",
                ShelterId = shelters[5].Id
            };
            shelterStaff6.PasswordHash = passwordHasher.HashPassword(shelterStaff6, "Password123!");

            // Create public user
            var publicUser = new User
            {
                Email = "user@example.com",
                Role = "Public"
            };
            publicUser.PasswordHash = passwordHasher.HashPassword(publicUser, "Password123!");

            context.Users.AddRange(admin, shelterStaff1, shelterStaff2, shelterStaff3, shelterStaff4, shelterStaff5, shelterStaff6, publicUser);
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
                    ImageFileName = "pets/bella-labrador.jpg",
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
                    ImageFileName = "pets/whiskers-tabby.jpg",
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
                    ImageFileName = "pets/buddy-golden-retriever.jpg",
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
                    ImageFileName = "pets/luna-persian.jpg",
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
                    ImageFileName = "pets/charlie-beagle.jpg",
                    Status = "Available",
                    ShelterId = shelters[0].Id,
                    Shelter = shelters[0]
                },
                new Pet
                {
                    Name = "Mia",
                    Type = "Cat",
                    Breed = "Siamese",
                    AgeGroup = "Adult",
                    Gender = "Female",
                    Description = "Elegant Siamese cat with striking blue eyes. Loves to 'talk' to her humans.",
                    ImageFileName = "pets/mia-siamese.jpg",
                    Status = "Available",
                    ShelterId = shelters[3].Id,
                    Shelter = shelters[3]
                },
                new Pet
                {
                    Name = "Rocky",
                    Type = "Dog",
                    Breed = "German Shepherd",
                    AgeGroup = "Adult",
                    Gender = "Male",
                    Description = "Loyal and intelligent German Shepherd. Great guard dog and family companion.",
                    ImageFileName = "pets/rocky-german-shepherd.jpg",
                    Status = "Available",
                    ShelterId = shelters[4].Id,
                    Shelter = shelters[4]
                },
                new Pet
                {
                    Name = "Sophie",
                    Type = "Cat",
                    Breed = "Maine Coon",
                    AgeGroup = "Kitten",
                    Gender = "Female",
                    Description = "Fluffy Maine Coon kitten with a gentle temperament. Loves to be brushed.",
                    ImageFileName = "pets/sophie-maine-coon.jpg",
                    Status = "Available",
                    ShelterId = shelters[5].Id,
                    Shelter = shelters[5]
                },
                new Pet
                {
                    Name = "Max",
                    Type = "Dog",
                    Breed = "Border Collie",
                    AgeGroup = "Adult",
                    Gender = "Male",
                    Description = "Highly intelligent Border Collie who loves mental challenges and exercise.",
                    ImageFileName = "pets/max-border-collie.jpg",
                    Status = "Available",
                    ShelterId = shelters[0].Id,
                    Shelter = shelters[0]
                },
                new Pet
                {
                    Name = "Chloe",
                    Type = "Cat",
                    Breed = "British Shorthair",
                    AgeGroup = "Adult",
                    Gender = "Female",
                    Description = "Calm and affectionate British Shorthair. Perfect lap cat who loves attention.",
                    ImageFileName = "pets/chloe-british-shorthair.jpg",
                    Status = "Pending",
                    ShelterId = shelters[1].Id,
                    Shelter = shelters[1]
                },
                new Pet
                {
                    Name = "Duke",
                    Type = "Dog",
                    Breed = "Rottweiler",
                    AgeGroup = "Adult",
                    Gender = "Male",
                    Description = "Gentle giant Rottweiler with a heart of gold. Great with experienced owners.",
                    ImageFileName = "pets/duke-rottweiler.jpg",
                    Status = "Available",
                    ShelterId = shelters[2].Id,
                    Shelter = shelters[2]
                },
                new Pet
                {
                    Name = "Lily",
                    Type = "Cat",
                    Breed = "Ragdoll",
                    AgeGroup = "Kitten",
                    Gender = "Female",
                    Description = "Sweet Ragdoll kitten who goes limp when picked up. Very docile and loving.",
                    ImageFileName = "pets/lily-ragdoll.jpg",
                    Status = "Available",
                    ShelterId = shelters[3].Id,
                    Shelter = shelters[3]
                },
                new Pet
                {
                    Name = "Zeus",
                    Type = "Dog",
                    Breed = "Great Dane",
                    AgeGroup = "Adult",
                    Gender = "Male",
                    Description = "Majestic Great Dane with a gentle personality. Despite his size, he's a gentle giant.",
                    ImageFileName = "pets/zeus-great-dane.jpg",
                    Status = "Available",
                    ShelterId = shelters[4].Id,
                    Shelter = shelters[4]
                },
                new Pet
                {
                    Name = "Mittens",
                    Type = "Cat",
                    Breed = "Tuxedo",
                    AgeGroup = "Senior",
                    Gender = "Male",
                    Description = "Distinguished senior tuxedo cat looking for a quiet home to spend his golden years.",
                    ImageFileName = "pets/mittens-tuxedo.jpg",
                    Status = "Available",
                    ShelterId = shelters[5].Id,
                    Shelter = shelters[5]
                },
                new Pet
                {
                    Name = "Ruby",
                    Type = "Dog",
                    Breed = "Cocker Spaniel",
                    AgeGroup = "Puppy",
                    Gender = "Female",
                    Description = "Adorable Cocker Spaniel puppy with beautiful golden coat. Loves to play and cuddle.",
                    ImageFileName = "pets/ruby-cocker-spaniel.jpg",
                    Status = "Available",
                    ShelterId = shelters[0].Id,
                    Shelter = shelters[0]
                },
                new Pet
                {
                    Name = "Shadow",
                    Type = "Cat",
                    Breed = "Black Cat",
                    AgeGroup = "Adult",
                    Gender = "Male",
                    Description = "Mysterious black cat with green eyes. Very affectionate once he gets to know you.",
                    ImageFileName = "pets/shadow-black-cat.jpg",
                    Status = "Available",
                    ShelterId = shelters[1].Id,
                    Shelter = shelters[1]
                },
                new Pet
                {
                    Name = "Daisy",
                    Type = "Dog",
                    Breed = "Poodle",
                    AgeGroup = "Adult",
                    Gender = "Female",
                    Description = "Intelligent and hypoallergenic Poodle. Great for families with allergies.",
                    ImageFileName = "pets/daisy-poodle.jpg",
                    Status = "Pending",
                    ShelterId = shelters[2].Id,
                    Shelter = shelters[2]
                },
                new Pet
                {
                    Name = "Ginger",
                    Type = "Cat",
                    Breed = "Orange Tabby",
                    AgeGroup = "Kitten",
                    Gender = "Female",
                    Description = "Playful orange tabby kitten with endless energy. Loves interactive toys.",
                    ImageFileName = "pets/ginger-orange-tabby.jpg",
                    Status = "Available",
                    ShelterId = shelters[3].Id,
                    Shelter = shelters[3]
                },
                new Pet
                {
                    Name = "Bear",
                    Type = "Dog",
                    Breed = "Newfoundland",
                    AgeGroup = "Adult",
                    Gender = "Male",
                    Description = "Gentle giant Newfoundland who loves water and children. Perfect family dog.",
                    ImageFileName = "pets/bear-newfoundland.jpg",
                    Status = "Available",
                    ShelterId = shelters[4].Id,
                    Shelter = shelters[4]
                },
                new Pet
                {
                    Name = "Princess",
                    Type = "Cat",
                    Breed = "Calico",
                    AgeGroup = "Adult",
                    Gender = "Female",
                    Description = "Beautiful calico cat with a regal personality. Loves to be pampered and adored.",
                    ImageFileName = "pets/princess-calico.jpg",
                    Status = "Available",
                    ShelterId = shelters[5].Id,
                    Shelter = shelters[5]
                }
            };

            context.Pets.AddRange(pets);
            await context.SaveChangesAsync();
        }
    }
}

