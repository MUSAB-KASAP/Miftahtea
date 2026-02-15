using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Application.DTOs
{
    public class ChangeUserRoleRequest
    {
        public Guid UserId { get; set; }

        // Yeni rol (Admin, User, Translator)
        public string NewRole { get; set; } = string.Empty;
    }
}
