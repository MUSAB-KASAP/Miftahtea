using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MiftahTEA.Application.DTOs;
using MiftahTEA.Application.Interfaces;
using MiftahTEA.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MiftahTEA.Application.Services
{
    public class RegisterService
    {
        private readonly IApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public RegisterService(
            IApplicationDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ================================
        // REGISTER
        // ================================
        public async Task<ApiResponse<string>> RegisterAsync(RegisterRequest request)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == request.Email);

            if (existingUser != null)
                return ApiResponse<string>.Fail("Bu email zaten kayıtlı.");

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = request.Role,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return ApiResponse<string>.SuccessResponse("Kayıt başarılı.");
        }

        // ================================
        // LOGIN
        // ================================
        public async Task<ApiResponse<object>> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == request.Email);

            if (user == null)
                return ApiResponse<object>.Fail("Kullanıcı bulunamadı.");

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return ApiResponse<object>.Fail("Şifre yanlış.");

            // 🔐 Access Token üret
            var accessToken = GenerateAccessToken(user);

            // 🔐 Refresh Token üret
            var refreshToken = Guid.NewGuid().ToString();

            user.RefreshTokenHash = BCrypt.Net.BCrypt.HashPassword(refreshToken);
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            await _context.SaveChangesAsync();

            return ApiResponse<object>.SuccessResponse(new
            {
                accessToken = accessToken,
                refreshToken = refreshToken
            });
        }

        // ================================
        // REFRESH TOKEN
        // ================================
        public async Task<ApiResponse<object>> RefreshTokenAsync(string refreshToken)
        {
            var users = await _context.Users
                .Where(x => x.RefreshTokenHash != null)
                .ToListAsync();

            var user = users.FirstOrDefault(u =>
                BCrypt.Net.BCrypt.Verify(refreshToken, u.RefreshTokenHash));

            if (user == null)
                return ApiResponse<object>.Fail("Geçersiz refresh token.");

            if (user.RefreshTokenExpiry < DateTime.UtcNow)
                return ApiResponse<object>.Fail("Refresh token süresi dolmuş.");

            var newAccessToken = GenerateAccessToken(user);

            return ApiResponse<object>.SuccessResponse(new
            {
                accessToken = newAccessToken
            });
        }

        // ================================
        // TOKEN GENERATOR
        // ================================
        private string GenerateAccessToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");

            var key = jwtSettings["Key"]
                ?? throw new Exception("JWT Key not found");

            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];
            var duration = double.Parse(jwtSettings["DurationInMinutes"] ?? "60");

            var securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(key));

            var credentials = new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(duration),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ================================
        // USER BAN / UNBAN
        // ================================
        public async Task<ApiResponse<string>> ToggleUserStatusAsync(ToggleUserStatusRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == request.UserId);

            if (user == null)
                return ApiResponse<string>.Fail("Kullanıcı bulunamadı.");

            // Kullanıcı aktif/pasif yapılır
            user.IsActive = request.IsActive;

            await _context.SaveChangesAsync();

            return ApiResponse<string>.SuccessResponse(
                request.IsActive ? "Kullanıcı aktif edildi." : "Kullanıcı banlandı.");
        }


    }
}
