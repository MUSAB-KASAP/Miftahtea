using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiftahTEA.Application.DTOs;
using MiftahTEA.Application.Interfaces;
using MiftahTEA.Domain.Entities;
using System.Security.Claims;

namespace MiftahTEA.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly IApplicationDbContext _context;

        public CustomerController(IApplicationDbContext context)
        {
            _context = context;
        }


        // ⭐ FAVORİ EKLE
        [Authorize(Roles = "Customer")]
        [HttpPost("favorite/{translatorId}")]
        public async Task<IActionResult> AddFavorite(Guid translatorId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var customerId = Guid.Parse(userId);

            var exists = await _context.FavoriteTranslators
                .AnyAsync(f => f.TranslatorId == translatorId && f.CustomerId == customerId);

            if (exists)
                return BadRequest("Zaten favorilere eklenmiş.");

            var favorite = new FavoriteTranslator
            {
                TranslatorId = translatorId,
                CustomerId = customerId
            };

            _context.FavoriteTranslators.Add(favorite);
            await _context.SaveChangesAsync();

            // 🔔 NOTIFICATION EKLENİYOR
            var notification = new Notification
            {
                UserId = translatorId,
                Title = "Yeni Favori",
                Message = "Profiliniz favorilere eklendi."
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok("Favorilere eklendi.");
        }

        // ⭐ FAVORİ LİSTESİ
        [Authorize(Roles = "Customer")]
        [HttpGet("favorites")]
        public async Task<IActionResult> GetMyFavorites()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var customerId = Guid.Parse(userId);

            var favorites = await _context.FavoriteTranslators
                .Where(f => f.CustomerId == customerId)
                .Include(f => f.Translator)
                .Select(f => new
                {
                    f.Translator.Id,
                    f.Translator.FullName,
                    f.Translator.PhotoUrl
                })
                .ToListAsync();

            return Ok(favorites);
        }

        // ⭐ FAVORİDEN ÇIKAR
        [Authorize(Roles = "Customer")]
        [HttpDelete("favorite/{translatorId}")]
        public async Task<IActionResult> RemoveFavorite(Guid translatorId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var customerId = Guid.Parse(userId);

            var favorite = await _context.FavoriteTranslators
                .FirstOrDefaultAsync(f => f.TranslatorId == translatorId && f.CustomerId == customerId);

            if (favorite == null)
                return NotFound("Favori bulunamadı.");

            _context.FavoriteTranslators.Remove(favorite);
            await _context.SaveChangesAsync();

            return Ok("Favoriden çıkarıldı.");
        }
        [Authorize(Roles = "Customer")]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var guid = Guid.Parse(userId);

            var user = await _context.Users
                .Where(u => u.Id == guid)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                   // u.PhoneNumber,
                    u.City,
                    u.PhotoUrl
                })
                .FirstOrDefaultAsync();

            return Ok(user);
        }
        [Authorize(Roles = "Customer")]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateCustomerProfileRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var guid = Guid.Parse(userId);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == guid);

            if (user == null)
                return NotFound("Kullanıcı bulunamadı.");

            user.FullName = request.FullName;
            //user.PhoneNumber = request.PhoneNumber;
            user.City = request.City;
            user.PhotoUrl = request.PhotoUrl;

            await _context.SaveChangesAsync();

            return Ok("Profil güncellendi.");
        }
    }
}