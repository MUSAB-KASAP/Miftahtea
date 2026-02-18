// User entity → sistemdeki kullanıcıyı temsil eder
// Bu class veritabanındaki Users tablosuna karşılık gelir
using MiftahTEA.Domain.Entities;
using MiftahTEA.Domain.Common;

namespace MiftahTEA.Domain.Entities
{
    public class User : BaseEntity
    {
        //  Kullanıcının adı soyadı
        public required string FullName { get; set; }

        //  Email adresi (login için kullanılır)
        public required string Email { get; set; }

        //  Şifrenin hashlenmiş hali (plain text ASLA tutulmaz)
        public required string PasswordHash { get; set; }

        //  Kullanıcı rolü (Admin, Translator, Customer)
        public required string Role { get; set; }

        //  Kullanıcı aktif mi? (admin kapatabilir)
        public bool IsActive { get; set; } = true;

        //  Translator onaylandı mı? (admin kontrol eder)
        public bool IsTranslatorApproved { get; set; } = false;

        //  Refresh token HASH (güvenlik için düz token tutulmaz)
        public string? RefreshTokenHash { get; set; }

        //  Refresh token süresi
        public DateTime? RefreshTokenExpiry { get; set; }
        public bool IsApproved { get; set; }

        public string? Bio { get; set; }

        public ICollection<TranslatorLanguagePair> TranslatorLanguagePairs { get; set; }
     = new List<TranslatorLanguagePair>();

    }
}
