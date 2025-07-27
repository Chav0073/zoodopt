import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import { currentUser } from "../data/mockup_data";
import UserContext from "../context/UserContext";
import AdminPage from "./pages/AdminPage/AdminPage";
import ManagePets from "./pages/ManagePets/ManagePets";
import ManageShelters from "./pages/ManageShelters/ManageShelters";
import ManageUsers from "./pages/ManageUsers/ManageUsers";

function App() {

  return (
    <>
    <UserContext.Provider user={currentUser}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<HomePage />} />
            <Route path="admin" element={<AdminPage/>}>
              <Route path="shelters" element={<ManageShelters/>} />
              <Route path="pets" element={<ManagePets/>} />
              <Route path="users" element={<ManageUsers/>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
    </>
  )
}

export default App
