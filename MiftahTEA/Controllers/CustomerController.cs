using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MiftahTEA.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        // 🔒 SADECE CUSTOMER ROLÜ GİREBİLİR
        [Authorize(Roles = "Customer")]
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            return Ok("Customer paneline hoş geldin 🛒");
        }
    }
}
