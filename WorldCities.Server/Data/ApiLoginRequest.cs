using Microsoft.Build.Framework;


namespace WorldCities.Server.Data
{
    public class ApiLoginRequest
    {
        [Required(ErrorMessage = "Email is required.")]
        public required string email { get; set; }
        [Required(ErrorMessage = "Password is required.")]
        public required string Password { get; set; }
    }
}
