import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";

import { mockPets, mockShelters, mockUsers } from "../data/mockup_data";
import UsersContext from "../context/UsersContext";
import PetsContext from "../context/PetsContext";
import SheltersContext from "../context/SheltersContext";
import Logout from "./pages/Logout/Logout";

import AdminPage from "./pages/AdminPage/AdminPage";
import ManagePets from "./components/ManagePets/ManagePets";
import ManageUsers from "./components/ManageUsers/ManageUsers";
import ManageShelters from "./components/ManageShelters/ManageShelters";

import RegisterPage from "./pages/Auth/RegisterUserPage";
import LoginUserPage from "./pages/Auth/LoginUserPage";
import AdoptPetPage from "./pages/Pets/AdoptPetPage";
import EditShelterPage from "./pages/EditShelterPage/EditShelterPage";
import EditPetPage from "./pages/EditPetPage/EditPetPage";
import MyApplicationsPage from "./pages/Pets/MyApplicationsPage";
import BrowsePetsPage from "./pages/BrowsePets/BrowsePetsPage";

import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./styles/primary-override.css";
import CreateShelterPage from "./pages/CreateShelter/CreateShelterPage";
import CreatePetPage from "./pages/CreatePet/CreatePetPage";
import EditUserPage from "./pages/EditUserPage/EditUserPage";
import CreateUserPage from "./pages/CreateUserPage/CreateUserPage";
import ShelterDashboardPage from "./pages/ShelterDashboardPage/ShelterDashboardPage";
import CreatePetInShelter from "./pages/CreatePetInShelter/CreatePetInShelter";

function App() {
  const [users, setUsers] = useState(mockUsers);
  const [pets, setPets] = useState(mockPets);
  const [shelters, setShelters] = useState(mockShelters);

  return (
    <PetsContext.Provider value={{ pets, setPets }}>
      <SheltersContext.Provider value={{ shelters, setShelters }}>
        <UsersContext.Provider value={{ users, setUsers }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="browse-pets" element={<BrowsePetsPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="login" element={<LoginUserPage />} />
                <Route path="logout" element={<Logout />} />
                <Route path="pets/adopt/:id" element={<AdoptPetPage />} />
                <Route
                  path="pets/my-applications"
                  element={<MyApplicationsPage />}
                />

                <Route path="admin" element={<AdminPage />}>
                  <Route path="shelters" element={<ManageShelters />} />
                  <Route
                    path="shelters/edit/:shelterId"
                    element={<EditShelterPage />}
                  />
                  <Route
                    path="shelters/create"
                    element={<CreateShelterPage />}
                  />
                  <Route path="pets" element={<ManagePets />} />
                  <Route path="pets/edit/:petId" element={<EditPetPage />} />
                  <Route path="pets/create" element={<CreatePetPage />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="users/edit/:userId" element={<EditUserPage />} />
                  <Route path="users/create" element={<CreateUserPage />} />
                </Route>

                <Route
                  path="shelter/:shelterId"
                  element={<ShelterDashboardPage />}
                />
                <Route
                  path="shelter/:shelterId/create"
                  element={<CreatePetInShelter />}
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </UsersContext.Provider>
      </SheltersContext.Provider>
    </PetsContext.Provider>
  );
}

export default App;
