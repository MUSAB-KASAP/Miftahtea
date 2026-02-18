using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Application.DTOs
{
    namespace MiftahTEA.Application.DTOs
    {
        public class AdminDashboardResponse
        {
            public int TotalUsers { get; set; }
            public int TotalTranslators { get; set; }
            public int PendingTranslators { get; set; }
            public int ActiveUsers { get; set; }
            public int BannedUsers { get; set; }

            public required List<PendingTranslatorDto> PendingTranslatorList { get; set; }
        }

        public class PendingTranslatorDto
        {
            public Guid Id { get; set; }
            public required string FullName { get; set; }
            public required string Email { get; set; }
            public DateTime CreatedDate { get; set; }
        }
    }

}
