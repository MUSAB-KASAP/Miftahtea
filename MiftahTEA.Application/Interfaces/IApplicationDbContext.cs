using Microsoft.EntityFrameworkCore;
using MiftahTEA.Domain.Entities;
using MiftahTEA.Domain.Entities.MiftahTEA.Domain.Entities;

namespace MiftahTEA.Application.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; set; }
        DbSet<Language> Languages { get; set; }
        DbSet<City> Cities { get; set; }
        DbSet<TranslatorLanguagePair> TranslatorLanguagePairs { get; set; }
        DbSet<ContactMessage> ContactMessages { get; set; }
        DbSet<Role> Roles { get; }


        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
