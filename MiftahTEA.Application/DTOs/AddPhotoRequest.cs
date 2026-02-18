using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Application.DTOs
{
    public class AddPhotoRequest
    {
        public Guid UserId { get; set; }
        public string PhotoUrl { get; set; }
    }

}
