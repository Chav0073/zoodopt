# Images Directory Structure

This directory contains all static images for the ZooDopt application.

## Organization

### `/pets/`

Contains 20 pet images used in the application seeder:

- Images are named using the pattern: `[pet-name]-[breed].jpg`
- All images are referenced in `backend/Data/DbInitializer.cs`
- Used via the `ImageFileName` property in Pet entities

### `/shelters/`

Contains 6 shelter logo images:

- Images are named using the pattern: `[shelter-name].jpg`
- All images are referenced in `backend/Data/DbInitializer.cs`
- Used via the `Logo` property in Shelter entities

## Image Serving

Images are served statically by the backend at:

- Pet images: `http://localhost:5217/images/pets/[filename]`
- Shelter images: `http://localhost:5217/images/shelters/[filename]`

The `ImageService` automatically prepends `/images/` to filenames for URL generation.

## Maintenance

- All images in this directory should be referenced in the database seeder
- Orphan images should be removed during cleanup
- New images should follow the established naming conventions
