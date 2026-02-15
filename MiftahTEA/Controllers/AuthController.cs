// Bu controller, kullanıcı kayıt (register) işlemini API üzerinden alıp RegisterService aracılığıyla veritabanına kaydeder.
// RegisterService, kullanıcı kayıt işlemini (validation, şifre işlemleri, veritabanına kaydetme vb.) iş katmanında gerçekleştiren servistir.

using Microsoft.AspNetCore.Mvc;
using MiftahTEA.Application.DTOs;
using MiftahTEA.Application.Services;
using System.IO;



namespace MiftahTEA.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly RegisterService _registerService;

    public AuthController(RegisterService registerService)
    {
        _registerService = registerService;
    }

    // ✅ REGISTER
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var result = await _registerService.RegisterAsync(request);

        // Service artık ApiResponse dönecek
        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    // ✅ LOGIN
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var result = await _registerService.LoginAsync(request);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    // ✅ REFRESH TOKEN
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string refreshToken)
    {
        var result = await _registerService.RefreshTokenAsync(refreshToken);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

}
