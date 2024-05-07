using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.MSSqlServer;
using WorldCities.Server.Data;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.



// Add Serilog support
//builder.Host.UseSerilog((ctx, lc) => lc
//    .ReadFrom.Configuration(ctx.Configuration)
//    .WriteTo.MSSqlServer(connectionString: ctx.Configuration.GetConnectionString("DefaultConnection"),
//        restrictedToMinimumLevel: LogEventLevel.Information, 
//        sinkOptions: new MSSqlServerSinkOptions
//        {
//            TableName = "LogEvents",
//            AutoCreateSqlDatabase = true
//        }).WriteTo.Console());



builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {// per migliorare la leggibilità dell'output json nei browser che non sopportano la formattazione JSON automatica
     //TODO: ++ la commento per non aver degrado delle prestazioni.
        options.JsonSerializerOptions.WriteIndented = true;
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// add connection Db
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

// Serilog Logging HTTP requests
//app.UseSerilogRequestLogging();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
