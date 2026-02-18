using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Application.DTOs
{
    // Login sırasında frontend'den gelecek veriyi temsil eder
    public class LoginRequest
    {
        // Kullanıcının giriş yaparken yazdığı email
        public required string Email { get; set; }

        // Kullanıcının yazdığı düz (plain text) şifre
        public required string Password { get; set; }
    }
}
