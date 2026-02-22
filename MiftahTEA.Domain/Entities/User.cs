// User entity → sistemdeki kullanıcıyı temsil eder
// Bu class veritabanındaki Users tablosuna karşılık gelir
using MiftahTEA.Domain.Common;
using MiftahTEA.Domain.Entities;
using MiftahTEA.Domain.Entities.MiftahTEA.Domain.Entities;

namespace MiftahTEA.Domain.Entities
{
    public class User : BaseEntity
    {
        //  Kullanıcının adı soyadı
        public  string FullName { get; set; }

        //  Email adresi (login için kullanılır)
        public  string Email { get; set; }

        //  Şifrenin hashlenmiş hali (plain text ASLA tutulmaz)
        public  string PasswordHash { get; set; }

        //  Kullanıcı rolü (Admin, Translator, Customer)
        public Guid RoleId { get; set; }
        public Role Role { get; set; }

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

        public string? City { get; set; }


        public ICollection<TranslatorLanguagePair> TranslatorLanguagePairs { get; set; }
     = new List<TranslatorLanguagePair>();
        public string? PhotoUrl { get; set; }
    }
}
