using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Application.DTOs
{
    namespace MiftahTEA.Application.DTOs
    {
        public class SendContactMessageRequest
        {
            public Guid TranslatorId { get; set; }
            public required string SenderName { get; set; }
            public required string SenderEmail { get; set; }
            public required string Message { get; set; }
        }
    }

}
