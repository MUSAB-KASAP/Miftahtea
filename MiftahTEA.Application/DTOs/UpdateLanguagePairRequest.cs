using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Application.DTOs
{
    public class UpdateLanguagePairRequest
    {
        public Guid PairId { get; set; }
        public decimal BasePrice { get; set; }
        public required string  PriceDescription { get; set; }
    }
}
