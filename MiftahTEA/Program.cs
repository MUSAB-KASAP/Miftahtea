using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MiftahTEA.Application.Interfaces;
using MiftahTEA.Application.Services;
using MiftahTEA.Infrastructure.Persistence;
using MiftahTEA.WebAPI.Hubs;
using Serilog;
using System.Text;
using System.Linq;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console() // console'a log basar
    .WriteTo.File("logs/log.txt", rollingInterval: RollingInterval.Day) // dosyaya yazar
    .CreateLogger();

// WebApplicationBuilder, ASP.NET Core 6 ile gelen yeni bir yapı
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("MiftahFrontendPolicy",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
});


// Serilog'u aktif ediyoruz
builder.Host.UseSerilog();

// Email Service'i dependency injection'a ekliyoruz
builder.Services.AddScoped<EmailService>();

// SignalR SERVİSİ EKLEME
builder.Services.AddSignalR();


//  CONTROLLER SERVİSİ EKLEME
// API'nin controller'larını aktif eder

builder.Services.AddControllers();

// Swagger → API test arayüzü
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//  DATABASE BAĞLANTISI
// ApplicationDbContext'i SQL Server ile bağlar

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//  DEPENDENCY INJECTION
// Clean Architecture için interface → implementation eşlemesi

builder.Services.AddScoped<IApplicationDbContext, ApplicationDbContext>();
builder.Services.AddScoped<RegisterService>();

//  JWT AYARLARINI OKUMA
// appsettings.json içindeki JwtSettings bölümünü alır

var jwtSettings = builder.Configuration.GetSection("JwtSettings");

// Eğer Key yoksa sistemi başlatma (güvenlik için zorunlu)
var key = jwtSettings["Key"]
          ?? throw new Exception("JWT Key not found in configuration");

// AUTHENTICATION KONFIGÜRASYONU
// API'nin JWT token doğrulamasını sağlar

builder.Services.AddAuthentication(options =>
{
    // Varsayılan kimlik doğrulama yöntemi JWT olacak
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // Token'ın hangi sistem tarafından üretildiğini kontrol eder
        ValidateIssuer = true,

        // Token'ın hangi kullanıcı kitlesi için üretildiğini kontrol eder
        ValidateAudience = true,

        // Token süresi dolmuş mu kontrol eder
        ValidateLifetime = true,

        // Token imza doğrulaması yapılır
        ValidateIssuerSigningKey = true,

        // appsettings.json'daki Issuer değeri
        ValidIssuer = jwtSettings["Issuer"],

        // appsettings.json'daki Audience değeri
        ValidAudience = jwtSettings["Audience"],

        // Token imzalama anahtarı (secret key)
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key))
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrEmpty(accessToken) &&
                path.StartsWithSegments("/chatHub"))
            {
                context.Token = accessToken;
            }

            return Task.CompletedTask;
        }
    };
});

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme."
    });



    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

//builder.WebHost.UseUrls("http://0.0.0.0:5124");

var app = builder.Build();

app.UseMiddleware<MiftahTEA.API.Middlewares.GlobalExceptionMiddleware>();



//  DEVELOPMENT ORTAMINDA SWAGGER
// Sadece development ortamında aktif olur

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// HTTPS yönlendirme
app.UseHttpsRedirection();

// CORS politikası ekleme
app.UseCors("MiftahFrontendPolicy");


// AUTH MIDDLEWARE SIRASI
// Önce Authentication (kimlik doğrulama)
// Sonra Authorization (yetkilendirme)

app.UseAuthentication();   // 🔐 Token doğrulama yapılır
app.UseAuthorization();    // 🔒 Role / yetki kontrolü yapılır

// Controller route'larını aktif eder
app.MapControllers();

app.UseSerilogRequestLogging();

// SignalR hub'ını route'a ekler
app.MapHub<ChatHub>("/chatHub");

// wwwroot klasöründeki statik dosyaları sunar (örneğin, resimler, css, js)
app.UseStaticFiles();


app.Run();