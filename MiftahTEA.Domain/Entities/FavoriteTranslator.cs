using MiftahTEA.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Domain.Entities
{
    public class FavoriteTranslator : BaseEntity
    {
        public User Translator { get; set; }
        public Guid TranslatorId { get; set; }
        public Guid CustomerId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
