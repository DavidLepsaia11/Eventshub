using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventsHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addindexToEventStartDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Events_StartDate",
                table: "Events",
                column: "StartDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Events_StartDate",
                table: "Events");
        }
    }
}
