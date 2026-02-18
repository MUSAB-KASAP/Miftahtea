using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Application.DTOs
{
    public class ToggleUserStatusRequest
    {
        public Guid UserId { get; set; }
        public bool IsActive { get; set; }
    }
}
