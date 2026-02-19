using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Application.DTOs
{
    public class AddLanguagePairRequest
    {
        public Guid SourceLanguageId { get; set; }
        public Guid TargetLanguageId { get; set; }
        public decimal BasePrice { get; set; }
        public required string PriceDescription { get; set; }
    }

}

