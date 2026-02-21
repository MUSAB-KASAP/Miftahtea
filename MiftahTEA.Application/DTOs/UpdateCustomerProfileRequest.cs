using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Application.DTOs
{
    public class UpdateCustomerProfileRequest
    {
        public string FullName { get; set; }
        //public string? PhoneNumber { get; set; }
        public string? City { get; set; }
        public string? PhotoUrl { get; set; }
    }
}
