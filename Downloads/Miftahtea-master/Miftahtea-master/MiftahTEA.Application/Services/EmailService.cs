using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace MiftahTEA.Application.Services
{
    public class EmailService
    {
        private readonly string _email = "SENİN_MAILİN@gmail.com";
        private readonly string _password = "APP_PASSWORD";

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(_email, _password),
                EnableSsl = true,
            };

            var mail = new MailMessage
            {
                From = new MailAddress(_email),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };

            mail.To.Add(to);

            await smtpClient.SendMailAsync(mail);
        }
    }
}