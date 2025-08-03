import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";

import { currentUser, mockPets, mockShelters, mockUsers } from "../data/mockup_data";

import UserContext from "../context/UserContext";
import UsersContext from "../context/UsersContext";
import PetsContext from "../context/PetsContext";
import SheltersContext from "../context/SheltersContext";

import AdminPage from "./pages/AdminPage/AdminPage";
import ManagePets from "./components/ManagePets/ManagePets";
import ManageUsers from "./components/ManageUsers/ManageUsers";
import ManageShelters from "./components/ManageShelters/ManageShelters";

import RegisterPage from "./pages/Auth/RegisterUserPage";
import LoginUserPage from "./pages/Auth/LoginUserPage";
import AdoptPetPage from "./pages/Pets/AdoptPetPage";
import EditShelterPage from "./pages/EditShelterPage/EditShelterPage";
import EditPetPage from "./pages/EditPetPage/EditPetPage";

import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [user, setUser] = useState(currentUser);
  const [users, setUsers] = useState(mockUsers);
  const [pets, setPets] = useState(mockPets);
  const [shelters, setShelters] = useState(mockShelters);

  return (
    <UserContext.Provider value={user}>
      <PetsContext.Provider value={pets}>
        <SheltersContext.Provider value={shelters}>
          <UsersContext.Provider value={users}>
            <BrowserRouter>
              <Routes>
                {/* Auth routes */}
                <Route path="register" element={<RegisterPage />} />
                <Route path="login" element={<LoginUserPage />} />

                {/* Pet adoption route */}
                <Route path="pets/adopt/:id" element={<AdoptPetPage />} />

                {/* Main app layout */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                
                  {/* Admin nested routes */}
                  <Route path="admin" element={<AdminPage />}>
                    <Route path="shelters" element={<ManageShelters />} />
                    <Route path="shelters/edit/:shelterId" element={<EditShelterPage />}/>
                    <Route path="pets" element={<ManagePets />} />
                    <Route path="pets/edit/:petId" element={<EditPetPage />} />
                    <Route path="users" element={<ManageUsers />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </UsersContext.Provider>
        </SheltersContext.Provider>
      </PetsContext.Provider>
    </UserContext.Provider>
  )
}

export default App;
