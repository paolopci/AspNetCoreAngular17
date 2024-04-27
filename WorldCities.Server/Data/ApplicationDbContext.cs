using Microsoft.EntityFrameworkCore;
using WorldCities.Server.Data.Models;


namespace WorldCities.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        protected ApplicationDbContext() : base()
        {
        }

        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<City> Cities { get; set; }
        public DbSet<Country> Countries { get; set; }
    }
}
