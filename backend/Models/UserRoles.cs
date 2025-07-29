namespace backend.Models;

public static class UserRoles
{
    public const string Public = "Public";
    public const string ShelterStaff = "ShelterStaff";
    public const string Admin = "Admin";

    public static readonly string[] All = { Public, ShelterStaff, Admin };
}
