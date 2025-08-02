import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import { currentUser, mockPets, mockShelters, mockUsers } from "../data/mockup_data";
import UserContext from "../context/UserContext";
import AdminPage from "./pages/AdminPage/AdminPage";
import ManagePets from "./components/ManagePets/ManagePets";
import ManageUsers from "./components/ManageUsers/ManageUsers";
import ManageShelters from "./components/ManageShelters/ManageShelters";
import { useState } from "react";
import PetsContext from "../context/PetsContext";
import SheltersContext from "../context/SheltersContext";
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import UsersContext from "../context/UsersContext";

function App() {

  const [user, setUser] = useState(currentUser);
  const [users, setUsers] = useState(mockUsers);
  const [pets, setPets] = useState(mockPets);
  const [shelters, setShelters] = useState(mockShelters);

  return (
    <>
    <UserContext.Provider value={currentUser}>
      <PetsContext.Provider value={pets}>
        <SheltersContext.Provider value={shelters}>
          <UsersContext.Provider value={users}>
              <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                
                <Route path="admin" element={<AdminPage />}>
                  <Route path="shelters" element={<ManageShelters />} />
                  <Route path="pets" element={<ManagePets />} />
                  <Route path="users" element={<ManageUsers />} />
                </Route>
              </Route>
              </Routes>
            </BrowserRouter>
          </UsersContext.Provider>
      </SheltersContext.Provider>
       </PetsContext.Provider>
    </UserContext.Provider>
    </>
  )
}

export default App
