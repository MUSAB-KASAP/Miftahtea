using MiftahTEA.Domain.Common;

namespace MiftahTEA.Domain.Entities
{
    public class ContactMessage : BaseEntity
    {
        public Guid TranslatorId { get; set; }
        public  User Translator { get; set; }

        public  string SenderName { get; set; }
        public  string SenderEmail { get; set; }
        public  string Message { get; set; }

        public bool IsRead { get; set; } = false;
    }
}
