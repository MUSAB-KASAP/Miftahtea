using Microsoft.EntityFrameworkCore;
using MiftahTEA.Application.Interfaces;
using MiftahTEA.Domain.Entities;

namespace MiftahTEA.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<TranslatorLanguagePair> TranslatorLanguagePairs { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TranslatorLanguagePair>()
                .Property(p => p.BasePrice)
                .HasPrecision(18, 2);

            // 🔥 Cascade fix
            modelBuilder.Entity<TranslatorLanguagePair>()
                 .HasOne(t => t.SourceLanguage)
                 .WithMany()
                 .HasForeignKey(t => t.SourceLanguageId)
                 .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TranslatorLanguagePair>()
                .HasOne(t => t.TargetLanguage)
                .WithMany()
                .HasForeignKey(t => t.TargetLanguageId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TranslatorLanguagePair>()
                .HasOne(t => t.Translator)
                .WithMany(u => u.TranslatorLanguagePairs)
                .HasForeignKey(t => t.TranslatorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ContactMessage>()
                .HasOne(c => c.Translator)
                .WithMany()
                .HasForeignKey(c => c.TranslatorId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Language>().HasData(
                new Language
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Name = "Türkçe",
                    Code = "TR",
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                new Language
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Name = "Arapça",
                    Code = "AR",
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                new Language
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    Name = "English",
                    Code = "EN",
                    CreatedDate = new DateTime(2025, 1, 1)
                }
            );
        }
    }
}
