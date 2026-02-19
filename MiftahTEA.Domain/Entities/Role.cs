using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Domain.Entities
{
    namespace MiftahTEA.Domain.Entities
    {
        public class Role
        {
            public Guid Id { get; set; }

            public string Name { get; set; }

            public ICollection<User> Users { get; set; }
        }
    }

}
