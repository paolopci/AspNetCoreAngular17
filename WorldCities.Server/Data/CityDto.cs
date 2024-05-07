using System.ComponentModel.DataAnnotations.Schema;
using WorldCities.Server.Data.Models;


namespace WorldCities.Server.Data
{
    public class CityDto
    {
        public int Id { get; set; }

        public required string Name { get; set; } = null!;

        [Column(TypeName = "decimal(7,4)")]
        public decimal Lat { get; set; }

        [Column(TypeName = "decimal(7,4)")]
        public decimal Lon { get; set; }

        [ForeignKey(nameof(Country))]
        public int CountryId { get; set; }

        public string? CountryName { get; set; } = null!;


    }
}
