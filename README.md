# Pet Adoption App

## Description:

Zoodopt is a web-based pet adoption platform designed to connect animal shelters with individuals looking to adopt. It enables shelters to list adoptable pets, and allows users to browse pet profiles and submit adoption applications. The system aims to streamline the pet adoption process by offering a centralized, user-friendly interface for both shelters and the public.

## Key Features:

### For Public Users:

- Browse all adoptable pets across registered shelters.
- View detailed pet profiles including images, age, and breed.
- Submit adoption applications for individual pets.

### For Shelter Staff:

- Post and manage their own adoptable pets.
- View and manage adoption applications submitted for their pets.

## Resources / Data Models:

- **Users**
- **Shelters**
- **Pets**
  - Includes fields: `name`, `type`, `ageGroup`, `description`, `imageFileName`, `shelterId`
- **Applications**

## Technology Stack:

- **Frontend:** React.js
- **Backend:** ASP.NET Core + Entity Framework Core
- **Database:** PostgreSQL
- **Languages:** JavaScript and C#

## 🔧 Local Configuration

To run the backend locally, you need to create a development configuration file.

### 1. Copy the Template

Rename the following file **in the `main` branch before branching** to ensure it exists across all future branches:

```
appsettings.Development.template.json → appsettings.Development.json
```

⚠️ If you create the file **after** branching, you’ll have to recreate it manually in each new branch.

### 2. Update Your Database Connection

Edit the new file and fill in your actual PostgreSQL credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=zoodopt;Username=your_db_username;Password=your_db_password"
  }
}
```

> ❗ `appsettings.Development.json` is ignored by Git and must be created manually by each developer.

### 3. Run the Backend

```bash
dotnet build
dotnet run
```

Swagger UI will be available at:

```
http://localhost:5217/swagger
```
