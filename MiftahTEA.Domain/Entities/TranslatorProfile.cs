using MiftahTEA.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Domain.Entities
{
    public class TranslatorProfile : BaseEntity
    {
        public Guid TranslatorId { get; set; }
        public User Translator { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
