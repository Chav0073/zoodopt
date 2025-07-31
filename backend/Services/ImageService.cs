using Microsoft.AspNetCore.Http;

namespace backend.Services
{
    public interface IImageService
    {
        Task<string> SaveImageAsync(IFormFile imageFile);
        bool DeleteImage(string fileName);
        string GetImageUrl(string fileName);
        bool ImageExists(string fileName);
    }

    public class ImageService : IImageService
    {
        private readonly string _imageDirectory;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<ImageService> _logger;

        public ImageService(IWebHostEnvironment environment, ILogger<ImageService> logger)
        {
            _environment = environment;
            _logger = logger;
            _imageDirectory = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "images");
            
            // Create images directory if it doesn't exist
            if (!Directory.Exists(_imageDirectory))
            {
                Directory.CreateDirectory(_imageDirectory);
            }
        }

        public async Task<string> SaveImageAsync(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
                throw new ArgumentException("Invalid image file");

            // Validate file type
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var fileExtension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
            
            if (!allowedExtensions.Contains(fileExtension))
                throw new ArgumentException("Invalid file type. Only image files are allowed.");

            // Validate file size (5MB max)
            const int maxFileSize = 5 * 1024 * 1024; // 5MB
            if (imageFile.Length > maxFileSize)
                throw new ArgumentException("File size too large. Maximum size is 5MB.");

            // Generate unique filename
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(_imageDirectory, fileName);

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                _logger.LogInformation("Image saved successfully: {FileName}", fileName);
                return fileName;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving image file: {FileName}", fileName);
                throw new InvalidOperationException("Failed to save image file", ex);
            }
        }

        public bool DeleteImage(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return false;

            try
            {
                var filePath = Path.Combine(_imageDirectory, fileName);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    _logger.LogInformation("Image deleted successfully: {FileName}", fileName);
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting image file: {FileName}", fileName);
                return false;
            }
        }

        public string GetImageUrl(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return string.Empty;

            return $"/images/{fileName}";
        }

        public bool ImageExists(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return false;

            var filePath = Path.Combine(_imageDirectory, fileName);
            return File.Exists(filePath);
        }
    }
}
