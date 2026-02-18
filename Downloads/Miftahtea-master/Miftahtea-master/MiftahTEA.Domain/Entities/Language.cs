using MiftahTEA.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Domain.Entities
{
    public class Language : BaseEntity
    {
        public required string Name { get; set; }     // Türkçe, Arapça, English

        public required string Code { get; set; }     // TR, AR, EN
    }
}
