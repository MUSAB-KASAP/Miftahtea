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
                p.SourceLanguageId == request.FromLanguageId &&
                p.TargetLanguageId == request.ToLanguageId);

            if (exists)
                return BadRequest(ApiResponse<string>.Fail("Bu dil çifti zaten mevcut."));

            if (request.FromLanguageId == request.ToLanguageId)
                return BadRequest(ApiResponse<string>.Fail("Kaynak ve hedef dil aynı olamaz."));

            var pair = new TranslatorLanguagePair
            {
                TranslatorId = guid,
                SourceLanguageId = request.FromLanguageId,
                TargetLanguageId = request.ToLanguageId,
                BasePrice = request.BasePrice,
                PriceDescription = request.PriceDescription
            };

            _context.TranslatorLanguagePairs.Add(pair);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse("Dil çifti eklendi."));
        }


    }
}
