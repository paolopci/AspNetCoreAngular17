using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorldCities.Server.Data;
using WorldCities.Server.Data.Models;

namespace WorldCities.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CountriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Countries
        [HttpGet]
        public async Task<ActionResult<ApiResult<CountryDTO>>> GetCountries(int pageIndex = 0, int pageSize = 10,
                                                                   string? sortColumn = null, string? sortOrder = null,
                                                                   string? filterColumn = null, string? filterQuery = null)
        {
            var countriesList = _context.Countries.AsNoTracking().Select(c=>new CountryDTO()
            {
                Id = c.Id,
                Name = c.Name,
                ISO2 = c.ISO2,
                ISO3 = c.ISO3,
                TotCities = c.Cities!.Count
            });
            if (!string.IsNullOrEmpty(filterColumn) && !string.IsNullOrEmpty(filterQuery))
            {
                countriesList = countriesList.Where(c => c.Name.StartsWith(filterQuery));
            }


            return await ApiResult<CountryDTO>.CreateAsync(countriesList, pageIndex, pageSize, sortColumn, sortOrder);
        }

        // GET: api/Countries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Country>> GetCountry(int id)
        {
            var country = await _context.Countries.FindAsync(id);

            if (country == null)
            {
                return NotFound();
            }

            return country;
        }

        // PUT: api/Countries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "RegisteredUser")]
        public async Task<IActionResult> PutCountry(int id, Country country)
        {
            if (id != country.Id)
            {
                return BadRequest();
            }

            _context.Entry(country).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CountryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Countries
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "RegisteredUser")]
        public async Task<ActionResult<Country>> PostCountry(Country country)
        {
            _context.Countries.Add(country);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCountry", new { id = country.Id }, country);
        }

        // DELETE: api/Countries/5
        [HttpDelete("{id}")]
          [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteCountry(int id)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null)
            {
                return NotFound();
            }

            _context.Countries.Remove(country);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        [Route("IsDupeField")]
        public bool IsDupeField(int countryId, string fieldName, string fieldValue)
        {
            /*
             isDupeField deve controllare individualmente ciascun campo a cui è assegnato.
             Dobbiamo farlo perché non vogliamo che più di un paese abbia lo stesso nome, lo stesso iso2 o lo stesso iso3.
             Questo spiega anche perché dobbiamo specificare un fieldName e un corrispondente fieldValue 
             invece di passare un'interfaccia Country: l'API lato server isDupeField dovrà eseguire 
             un controllo diverso per ogni fieldName che passeremo, invece di basarsi su un singolo 
             controllo generico come fa l'API isDupeCity.
           
             */
            switch (fieldName)
            {
                case "name":
                    return _context.Countries.Any(c => c.Name == fieldValue && c.Id != countryId);
                case "iso2":
                    return _context.Countries.Any(c => c.ISO2 == fieldValue && c.Id != countryId);
                case "iso3":
                    return _context.Countries.Any(c => c.ISO3 == fieldValue && c.Id != countryId);
                default:
                    return false;

            }
        }

        private bool CountryExists(int id)
        {
            return _context.Countries.Any(e => e.Id == id);
        }
    }
}
