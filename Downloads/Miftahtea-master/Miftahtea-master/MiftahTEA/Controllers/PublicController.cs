using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiftahTEA.Application.DTOs;
using MiftahTEA.Application.DTOs.MiftahTEA.Application.DTOs;
using MiftahTEA.Application.Interfaces;
using MiftahTEA.Application.Services;
using MiftahTEA.Domain.Entities;

namespace MiftahTEA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublicController : ControllerBase
    {
        private readonly IApplicationDbContext _context;
        private readonly EmailService _emailService;

        public PublicController(IApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        //  Translator listeleme
        [HttpGet("translators")]
        public async Task<IActionResult> GetTranslators(
            string? search,
            string? sourceLang,
            string? targetLang,
            int page = 1,
            int pageSize = 10)
        {
            var query = _context.Users
                .Where(u => u.Role == "Translator" && u.IsApproved && u.IsActive)
                .AsQueryable();

            //  Dil filtresi
            if (!string.IsNullOrEmpty(sourceLang) && !string.IsNullOrEmpty(targetLang))
            {
                query = query.Where(u =>
                    u.TranslatorLanguagePairs.Any(lp =>
                        lp.SourceLanguage.Code == sourceLang &&
                        lp.TargetLanguage.Code == targetLang));
            }

            //  Arama
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u => u.FullName.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var translators = await query
                .OrderBy(u => u.FullName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new
                {
                    u.Id,
                    u.FullName
                })
                .ToListAsync();

            return Ok(ApiResponse<object>.SuccessResponse(new
            {
                items = translators,
                totalCount,
                page,
                pageSize
            }));
        }

        //  Mesaj gönder + email
        [HttpPost("contact")]
        public async Task<IActionResult> SendContactMessage(SendContactMessageRequest request)
        {
            var translator = await _context.Users
                .Where(u => u.Id == request.TranslatorId
                         && u.Role == "Translator"
                         && u.IsTranslatorApproved
                         && u.IsActive)
                .FirstOrDefaultAsync();

            if (translator == null)
                return BadRequest(ApiResponse<string>.Fail("Translator bulunamadı"));

            var message = new ContactMessage
            {
                TranslatorId = request.TranslatorId,
                SenderName = request.SenderName,
                SenderEmail = request.SenderEmail,
                Message = request.Message
            };

            _context.ContactMessages.Add(message);
            await _context.SaveChangesAsync();

            //  EMAIL GÖNDER
            try
            {
                await _emailService.SendEmailAsync(
                    translator.Email,
                    "Yeni mesaj aldınız",
                    $"Size yeni bir mesaj geldi:<br/><b>{message.Message}</b>"
                );
            }
            catch
            {
                // hata olursa sistem durmaz
            }

            return Ok(ApiResponse<string>.SuccessResponse("Mesaj gönderildi"));
        }
    



         // Güncelleme işlemi sadece çevirmenler tarafından yapılabilir
        [Authorize(Roles = "Translator")]
        [HttpPut("languages")]
        public async Task<IActionResult> UpdateLanguagePair(UpdateLanguagePairRequest request)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var guid = Guid.Parse(userId);

            var pair = await _context.TranslatorLanguagePairs
                .FirstOrDefaultAsync(p => p.Id == request.PairId && p.TranslatorId == guid);

            if (pair == null)
                return NotFound(ApiResponse<string>.Fail("Dil çifti bulunamadı."));

            pair.BasePrice = request.BasePrice;
            pair.PriceDescription = request.PriceDescription;

            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse("Dil çifti güncellendi."));
        }

        // Silme işlemi sadece çevirmenler tarafından yapılabilir
        [Authorize(Roles = "Translator")]
        [HttpDelete("languages/{id}")]
        public async Task<IActionResult> DeleteLanguagePair(Guid id)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var guid = Guid.Parse(userId);

            var pair = await _context.TranslatorLanguagePairs
                .FirstOrDefaultAsync(p => p.Id == id && p.TranslatorId == guid);

            if (pair == null)
                return NotFound(ApiResponse<string>.Fail("Dil çifti bulunamadı."));

            _context.TranslatorLanguagePairs.Remove(pair);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse("Dil çifti silindi."));
        }


    }
}

