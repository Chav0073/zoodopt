using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class EnhancePetShelterModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Shelters",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Shelters",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Logo",
                table: "Shelters",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Shelters",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Breed",
                table: "Pets",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Pets",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Pets",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Shelters");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Shelters");

            migrationBuilder.DropColumn(
                name: "Logo",
                table: "Shelters");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Shelters");

            migrationBuilder.DropColumn(
                name: "Breed",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Pets");
        }
    }
}
