using MiftahTEA.Domain.Common;

namespace MiftahTEA.Domain.Entities
{
    public class TranslatorLanguagePair : BaseEntity
    {
        // Translator
        public Guid TranslatorId { get; set; }
        public  User Translator { get; set; }

        // Source Language
        public Guid SourceLanguageId { get; set; }
        public  Language SourceLanguage { get; set; }

        // Target Language
        public Guid TargetLanguageId { get; set; }
        public  Language TargetLanguage { get; set; }

        // Price
        public decimal BasePrice { get; set; }

        public  string PriceDescription { get; set; }


    }
}
