using System.Reflection;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Reflection;
using EFCore.BulkExtensions;


namespace WorldCities.Server.Data
{
    public class ApiResult<T>
    {
        public List<T> Data { get; private set; } // dati(records) ritornati.
        public int PageIndex { get; private set; } // pagina corrente index 0
        public int PageSize { get; private set; } // record x pagina
        public int TotalCount { get; private set; } // totale records in tabella
        public int TotalPages { get; private set; } // totale delle pagine
        public string? SortColumn { get; set; } // Nome della colonna di ordinamento
        public string? SortOrder { get; set; }  // tipo ordinamento "ASC" o "DESC"
        public string? FilterColumn { get; set; } // per filtrare le città colonna di filtro
        public string? FilterQuery { get; set; } // stringa da usare come filtro 
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

        private ApiResult(List<T> data, int totalCount, int pageIndex,
                          int pageSize, string? sortColumn, string? sortOrder,
                          string? filterColumn, string? filterQuery)
        {
            Data = data;
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalCount = totalCount;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            SortColumn = sortColumn;
            SortOrder = sortOrder;
            FilterColumn = filterColumn;
            FilterQuery = filterQuery;
        }

        public static async Task<ApiResult<T>> CreateAsync(IQueryable<T> source, int pageIndex, int pageSize,
                                                            string? sortColumn = null, string? sortOrder = null,
                                                            string? filterColumn = null, string? filterQuery = null)
        {

            if (!string.IsNullOrEmpty(filterColumn) && !string.IsNullOrEmpty(filterQuery) && IsValidProperty(filterColumn))
            {  // var result =Cities.Where(x=>x.Name.StartsWith("Pesar"));
                source = source.Where(string.Format("{0}.StartsWith(@0)", filterColumn, filterQuery));
            }



            var count = await source.CountAsync(); // ritorno il numero degli elementi della sequenza.
            if (!string.IsNullOrEmpty(sortColumn) && IsValidProperty(sortColumn))
            {
                sortOrder = !string.IsNullOrEmpty(sortOrder) && sortOrder.ToUpper() == "ASC" ? "ASC" : "DESC";
                source = source.OrderBy(string.Format("{0} {1}", sortColumn, sortOrder));
            }
            source = source.Skip(pageIndex * pageSize).Take(pageSize);
            // retrieve the SQL query (for debug purposes)
            #if DEBUG
            var sql = source.ToParametrizedSql();
            #endif
            var data = await source.ToListAsync();

            return new ApiResult<T>(
                data,
                count,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery
            );
        }

        public static bool IsValidProperty(string propertyName, bool throwExceptionIfNotFound = true)
        {
            var prop = typeof(T).GetProperty(propertyName,
                                              BindingFlags.IgnoreCase |
                                                        BindingFlags.Public |
                                                        BindingFlags.Instance);
            if (prop == null && throwExceptionIfNotFound)
            {
                throw new NotSupportedException(string.Format($"ERROR: Property '{propertyName}' does not exists."));
            }
            return prop != null;
        }
    }
}
