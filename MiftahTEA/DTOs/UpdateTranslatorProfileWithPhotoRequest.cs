using Microsoft.AspNetCore.Http;

namespace MiftahTEA.DTOs
{
    public class UpdateTranslatorProfileWithPhotoRequest
    {
        public string FullName { get; set; }
        public string? Bio { get; set; }
        public IFormFile? Photo { get; set; }
    }
}