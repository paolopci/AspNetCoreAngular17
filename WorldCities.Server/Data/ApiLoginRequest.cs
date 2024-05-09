using Microsoft.Build.Framework;
using System.ComponentModel.DataAnnotations;


namespace WorldCities.Server.Data
{
    public class ApiLoginRequest
    {
        [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Email is required.")]
        public required string email { get; set; }
        [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Password is required.")]
        public required string Password { get; set; }
    }
}
