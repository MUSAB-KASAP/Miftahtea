using System.Net;
using System.Text.Json;

namespace MiftahTEA.API.Middlewares
{
    // Uygulamadaki tüm beklenmeyen hataları yakalayıp tek formatta döndürür.
    public sealed class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context); // request pipeline devam
            }
            catch (Exception ex)
            {
                // Logla (şimdilik ILogger, Serilog'a geçince otomatik oraya akar)
                _logger.LogError(ex, "Unhandled exception");

                // Response standart ayarları
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = new ApiResponse<object>
                {
                    Success = false,
                    Data = null,
                    Message = "Beklenmeyen bir hata oluştu."
                };

                var json = JsonSerializer.Serialize(response);
                await context.Response.WriteAsync(json);
            }
        }
    }

    // Basit response wrapper (şimdilik burada; bir sonraki adımda Application katmanına taşıyacağız)
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? Message { get; set; }
    }
}
