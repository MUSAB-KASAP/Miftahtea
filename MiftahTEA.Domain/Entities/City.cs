using MiftahTEA.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Domain.Entities
{
    public class City : BaseEntity
    {
        public string Name { get; set; }   // İstanbul, Ankara, İzmir...
    }
}
