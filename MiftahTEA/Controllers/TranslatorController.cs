using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiftahTEA.Application.DTOs;
using MiftahTEA.Application.Interfaces;
using MiftahTEA.Domain.Entities;
using System.Security.Claims;

namespace MiftahTEA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TranslatorController : ControllerBase
    {
        private readonly IApplicationDbContext _context;

        public TranslatorController(IApplicationDbContext context)
        {
            _context = context;
        }

        // Tercuman paneli için dashboard bilgilerini döndüren endpoint
        [Authorize(Roles = "Translator")]
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var guid = Guid.Parse(userId);

            var totalMessages = await _context.ContactMessages
                .CountAsync(m => m.TranslatorId == guid);

            var unreadMessages = await _context.ContactMessages
                .CountAsync(m => m.TranslatorId == guid && !m.IsRead);

            var languageCount = await _context.TranslatorLanguagePairs
                .CountAsync(l => l.TranslatorId == guid);

            return Ok(ApiResponse<object>.SuccessResponse(new
            {
                TotalMessages = totalMessages,
                UnreadMessages = unreadMessages,
                LanguageCount = languageCount
            }));
        }

        // Mesaj listesi

        [Authorize(Roles = "Translator")]
        [HttpGet("messages")]
        public async Task<IActionResult> GetMyMessages()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var guid = Guid.Parse(userId);

            var messages = await _context.ContactMessages
                .Where(m => m.TranslatorId == guid)
                .OrderByDescending(m => m.CreatedDate)
                .Select(m => new
                {
                    m.Id,
                    m.SenderName,
                    m.SenderEmail,
                    m.Message,
                    m.IsRead,
                    m.CreatedDate
                })
                .ToListAsync();

            return Ok(ApiResponse<object>.SuccessResponse(messages));
        }

        [Authorize(Roles = "Translator")]
        [HttpGet("languages")]
        public async Task<IActionResult> GetMyLanguagePairs()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var guid = Guid.Parse(userId);

            var pairs = await _context.TranslatorLanguagePairs
                .Where(p => p.TranslatorId == guid)
                .Select(p => new
                {
                    p.Id,
                    From = p.SourceLanguage.Name,
                    To = p.TargetLanguage.Name,
                    p.BasePrice,
                    p.PriceDescription
                })
                .ToListAsync();

            return Ok(ApiResponse<object>.SuccessResponse(pairs));
        }

        [Authorize(Roles = "Translator")]
        [HttpPost("languages")]
        public async Task<IActionResult> AddLanguagePair(AddLanguagePairRequest request)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var guid = Guid.Parse(userId);

            var exists = await _context.TranslatorLanguagePairs.AnyAsync(p =>
                p.TranslatorId == guid &&
                p.SourceLanguageId == request.SourceLanguageId &&
                p.TargetLanguageId == request.TargetLanguageId);


            if (exists)
                return BadRequest(ApiResponse<string>.Fail("Bu dil çifti zaten mevcut."));

            if (request.SourceLanguageId == request.TargetLanguageId)
                return BadRequest(ApiResponse<string>.Fail("Kaynak ve hedef dil aynı olamaz."));

            var pair = new TranslatorLanguagePair
            {
                TranslatorId = guid,
                SourceLanguageId = request.SourceLanguageId,
                TargetLanguageId = request.TargetLanguageId,

                BasePrice = request.BasePrice,
                PriceDescription = request.PriceDescription
            };

            _context.TranslatorLanguagePairs.Add(pair);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse("Dil çifti eklendi."));
        }

        //  
        [Authorize(Roles = "Translator")]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateTranslatorProfileRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var guid = Guid.Parse(userId);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == guid);

            if (user == null)
                return NotFound(ApiResponse<string>.Fail("Kullanıcı bulunamadı."));

            //  VALIDATION BURAYA

            if (string.IsNullOrWhiteSpace(request.FullName))
                return BadRequest(ApiResponse<string>.Fail("İsim boş olamaz."));

            if (request.FullName.Length > 150)
                return BadRequest(ApiResponse<string>.Fail("İsim çok uzun."));

            if (request.Bio?.Length > 1000)
                return BadRequest(ApiResponse<string>.Fail("Biyografi en fazla 1000 karakter olabilir."));

            if (!string.IsNullOrEmpty(request.PhotoUrl))
            {
                if (!Uri.TryCreate(request.PhotoUrl, UriKind.Absolute, out _))
                    return BadRequest(ApiResponse<string>.Fail("Geçersiz fotoğraf linki."));
            }

            //  GÜNCELLEME BURADA

            user.FullName = request.FullName.Trim();
            user.Bio = request.Bio?.Trim();
            user.PhotoUrl = request.PhotoUrl?.Trim();

            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse("Profil güncellendi."));
        }

        [Authorize(Roles = "Translator")]
        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var guid = Guid.Parse(userId);

            var notifications = await _context.Notifications
                .Where(n => n.UserId == guid)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new
                {
                    n.Id,
                    n.Title,
                    n.Message,
                    n.IsRead,
                    n.CreatedAt
                })
                .ToListAsync();

            return Ok(notifications);
        }
        [Authorize(Roles = "Translator")]
        [HttpPut("notifications/{id}/read")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id);

            if (notification == null)
                return NotFound();

            notification.IsRead = true;

            await _context.SaveChangesAsync();

            return Ok();
        }

    }
}
