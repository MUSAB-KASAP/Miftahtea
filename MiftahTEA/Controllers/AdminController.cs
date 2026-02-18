using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiftahTEA.Application.DTOs;
using MiftahTEA.Application.DTOs.MiftahTEA.Application.DTOs;
using MiftahTEA.Application.Interfaces;
using MiftahTEA.Application.Services;
using System.Security.Claims;

namespace MiftahTEA.Controllers
{
    // api projesi
    [Route("api/[controller]")]
    [ApiController]
    //projeyi bozdum
    // o güvenliğin amk
    // ben kemal geliyorum
    public class AdminController : ControllerBase
    {
        private readonly IApplicationDbContext _context;
        private readonly RegisterService _registerService;

        public AdminController(
            IApplicationDbContext context,
            RegisterService registerService)
        {
            _context = context;
            _registerService = registerService;
        }


        // 🔒 Admin Dashboard
        [Authorize(Roles = "Admin")]
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var totalUsers = await _context.Users.CountAsync();

            var totalTranslators = await _context.Users
                .Where(u => u.Role == "Translator")
                .CountAsync();

            var pendingTranslators = await _context.Users
                .Where(u => u.Role == "Translator" && !u.IsTranslatorApproved)
                .CountAsync();

            var activeUsers = await _context.Users
                .Where(u => u.IsActive)
                .CountAsync();

            var bannedUsers = await _context.Users
                .Where(u => !u.IsActive)
                .CountAsync();

            var pendingList = await _context.Users
                .Where(u => u.Role == "Translator" && !u.IsTranslatorApproved)
                .OrderByDescending(u => u.CreatedDate)
                .Select(u => new PendingTranslatorDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    CreatedDate = u.CreatedDate
                })
                .Take(10)
                .ToListAsync();

            var response = new AdminDashboardResponse
            {
                TotalUsers = totalUsers,
                TotalTranslators = totalTranslators,
                PendingTranslators = pendingTranslators,
                ActiveUsers = activeUsers,
                BannedUsers = bannedUsers,
                PendingTranslatorList = pendingList
            };

            return Ok(ApiResponse<AdminDashboardResponse>.SuccessResponse(response));
        }



        // 👥 Kullanıcıları getir
        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.ToListAsync();

            return Ok(ApiResponse<object>.SuccessResponse(users));
        }

        // ❗ TEST ERROR EKLE (unutma)
        [HttpGet("test-error")]
        public IActionResult TestError()
        {
            throw new Exception("test");
        }

        // 🔄 Kullanıcı rol değiştirme
        [Authorize(Roles = "Admin")]
        [HttpPut("users/change-role")]
        public async Task<IActionResult> ChangeUserRole(ChangeUserRoleRequest request)
        {
            // 🔥 LOGIN OLAN USER ID
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // ❌ KENDİ ROLÜNÜ DEĞİŞTİREMEZ
            if (currentUserId == request.UserId.ToString())
            {
                return BadRequest(ApiResponse<object>.Fail("Kendi rolünü değiştiremezsin."));
            }

            var user = await _context.Users.FindAsync(request.UserId);

            if (user == null)
                return NotFound(ApiResponse<object>.Fail("Kullanıcı bulunamadı."));

            user.Role = request.NewRole;

            await _context.SaveChangesAsync();

            return Ok(ApiResponse<object>.SuccessResponse("Rol güncellendi."));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("users/toggle-active/{id}")]
        public async Task<IActionResult> ToggleUser(Guid id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (currentUserId == id.ToString())
                return BadRequest(ApiResponse<object>.Fail("Kendini pasif yapamazsın."));

            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound(ApiResponse<object>.Fail("Kullanıcı bulunamadı."));

            user.IsActive = !user.IsActive;

            await _context.SaveChangesAsync();

            return Ok(ApiResponse<object>.SuccessResponse("Kullanıcı durumu değiştirildi."));
        }
        // 🔥 Admin kullanıcı silebilir
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            // Kullanıcıyı bul
            var user = await _context.Users.FindAsync(id);

            // Eğer yoksa hata dön
            if (user == null)
                return BadRequest(ApiResponse<string>.Fail("Kullanıcı bulunamadı"));

            // Kendini silmesin (kritik güvenlik)
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (currentUserId == user.Id.ToString())
                return BadRequest(ApiResponse<string>.Fail("Kendini silemezsin"));

            // Kullanıcıyı sil
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse("Kullanıcı silindi"));
        }



        // 🔒 ADMIN → kullanıcı ban / unban
        [Authorize(Roles = "Admin")]
        [HttpPut("toggle-user-status")]
        public async Task<IActionResult> ToggleUserStatus(ToggleUserStatusRequest request)
        {
            var result = await _registerService.ToggleUserStatusAsync(request);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("messages")]
        public async Task<IActionResult> GetMessages()
        {
            var messages = await _context.ContactMessages
                .OrderByDescending(m => m.CreatedDate)
                .Select(m => new
                {
                    m.Id,
                    m.SenderName,
                    m.SenderEmail,
                    m.Message,
                    m.IsRead,
                    m.CreatedDate,
                    TranslatorName = m.Translator.FullName
                })
                .ToListAsync();

            return Ok(ApiResponse<object>.SuccessResponse(messages));
        }
        [Authorize(Roles = "Translator")]
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile(UpdateTranslatorProfileRequest request)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var guid = Guid.Parse(userId);

            var user = await _context.Users.FindAsync(guid);

            if (user == null)
                return NotFound(ApiResponse<string>.Fail("Kullanıcı bulunamadı"));

            user.FullName = request.FullName;
            user.Bio = request.Bio;

            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.SuccessResponse("Profil güncellendi"));
        }


    }
}
