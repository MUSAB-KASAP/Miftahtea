using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace MiftahTEA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        // 🔓 Herkes erişebilir
        [HttpGet("public")]
        public IActionResult PublicEndpoint()
        {
            return Ok("Bu endpoint herkese açık.");
        }

        // 🔐 Login olan herkes erişebilir
        [Authorize]
        [HttpGet("protected")]
        public IActionResult ProtectedEndpoint()
        {
            return Ok("Bu endpoint için login olmak gerekir.");
        }

        // 🔒 Sadece Admin rolü erişebilir
        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public IActionResult AdminOnly()
        {
            return Ok("Sadece Admin erişebilir.");
        }
    }
}
