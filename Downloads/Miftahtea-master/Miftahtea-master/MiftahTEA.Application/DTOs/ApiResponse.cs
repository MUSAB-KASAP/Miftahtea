namespace MiftahTEA.Application.DTOs
{
    // API'den dönecek standart response modeli
    public class ApiResponse<T>
    {
        // İşlem başarılı mı?
        public bool Success { get; set; }

        // Dönen veri (generic → her tür olabilir)
        public T? Data { get; set; }

        // Mesaj (hata veya bilgi mesajı)
        public string? Message { get; set; }

        // Başarılı response oluşturmak için hazır method
        public static ApiResponse<T> SuccessResponse(T data)
        {
            return new ApiResponse<T>
            {
                Success = true,   // başarılı
                Data = data,      // gelen veri
                Message = null    // mesaj yok
            };
        }

        // Hatalı response oluşturmak için hazır method
        public static ApiResponse<T> Fail(string message)
        {
            return new ApiResponse<T>
            {
                Success = false,  // başarısız
                Data = default,   // veri yok
                Message = message // hata mesajı
            };
        }

        
    }
}
