using Microsoft.EntityFrameworkCore;


namespace WorldCities.Server.Data
{
    public class ApiResult<T>
    {
        public List<T> Data { get; private set; } // dati(records) ritornati.
        public int PageIndex { get; private set; } // pagina corrente index 0
        public int PageSize { get; private set; } // record x pagina
        public int TotalCount { get; private set; } // totale records in tabella
        public int TotalPages { get; private set; } // totale delle pagine
        public bool HasPrevisionPage
        {
            // Restituisce true se la pagine corrente ha una pagina precedente.
            get { return (PageIndex > 0); }
        }

        public bool HasNextPage
        {
            // Restituisce true la pagina corrente ha una pagina successiva.
            get
            {
                return ((PageIndex + 1) < TotalPages);
            }
        }

        private ApiResult(List<T> data, int pageIndex, int pageSize, int totalCount)
        {
            Data = data;
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalCount = totalCount;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        }

        public static async Task<ApiResult<T>> CreateAsync(IQueryable<T> source, int pageIndex, int pageSize)
        {
            var count = await source.CountAsync(); // ritorno il numero degli elementi della sequenza.
            source = source.Skip(pageIndex * pageSize).Take(pageSize);
            var data = await source.ToListAsync();
            return new ApiResult<T>(
                data, 
                pageIndex, 
                pageSize, 
                count
            );
        }
    }
}
