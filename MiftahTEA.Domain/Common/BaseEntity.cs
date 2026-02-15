// BaseEntity, tüm entity'ler için ortak Id, oluşturulma ve güncellenme tarihlerini tutan temel (base) sınıftır.
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Domain.Common
{
    public abstract class BaseEntity
    {
        // Her kayıt için benzersiz Id oluşturur.
        public Guid Id { get; set; } = Guid.NewGuid();

        // Kaydın oluşturulma tarihini otomatik olarak atar.
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Kaydın güncellenme tarihini tutar (nullable).
        public DateTime? UpdatedDate { get; set; }
    }
}
