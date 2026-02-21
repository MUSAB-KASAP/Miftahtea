using MiftahTEA.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Domain.Entities
{
    public class ProfileView : BaseEntity
    {
        public Guid TranslatorId { get; set; }

        public Guid? ViewerId { get; set; }

        public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
    }
}
