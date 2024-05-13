using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using WorldCities.Server.Controllers;
using WorldCities.Server.Data;
using WorldCities.Server.Data.Models;


namespace WorldCities.Server.Tests
{
    public class SeedController_Tests
    {
        [Fact]
        public async Task CreateDefaultUsers()
        {
            // Arrange
            // create the option instances required by the ApplicationDbContext
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "WorldCities")
                .Options;
            // create a IWebHost environment mock instance
            var mockEnv = Mock.Of<IWebHostEnvironment>();
            // create a IConfiguration mock instance
            var mockConfiguration = new Mock<IConfiguration>();
            mockConfiguration.SetupGet(x => x[It.Is<string>(s => s == "DefaultPassword:RegisteredUser")])
                .Returns("MockP$$word");
            mockConfiguration.SetupGet(x => x[It.Is<string>(s => s == "DefaultPasswords:Administrator")])
                .Returns("MockP$$word");
            // create a ApplicationDbContext instance using the in-memory DB
            using var context = new ApplicationDbContext(options);
            // Create a RoleManager instance
            var roleManager = IdentityHelper.GetRoleManager(new RoleStore<IdentityRole>(context));
            // Create a UserManager instance
            var userManager = IdentityHelper.GetUserManager(new UserStore<ApplicationUser>(context));
            // Create a SeedController instance
            var controller = new SeedController(context, mockEnv, roleManager, userManager, mockConfiguration.Object);
            ApplicationUser user_Admin = null!;
            ApplicationUser user_User = null!;
            ApplicationUser user_NotExisting = null!;

            // TODO: ACT
            // execute the SeedController's CreateDefaultUsers()
            // method to create the default users (and roles)
            await controller.CreateDefaultUsers();
            // retrieve the users
            user_Admin = await userManager.FindByEmailAsync("admin@email.com");
            user_User = await userManager.FindByEmailAsync("user@email.com");
            user_NotExisting = await userManager.FindByEmailAsync("notexisting@email.com");

            // TODO: ASSERT
            Assert.NotNull(user_Admin);
            Assert.NotNull(user_User);
            Assert.Null(user_NotExisting);



        }
    }
}
