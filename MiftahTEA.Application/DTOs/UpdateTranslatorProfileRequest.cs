using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Application.DTOs
{
    public class UpdateTranslatorProfileRequest
    {
        public required string FullName { get; set; }
        public string? Bio { get; set; }

        public string? PhotoUrl { get; set; }
    }
}
