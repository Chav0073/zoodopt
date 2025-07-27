import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import { currentUser } from "../data/mockup_data";
import UserContext from "../context/UserContext";
import AdminPage from "./pages/AdminPage/AdminPage";

function App() {

  return (
    <>
    <UserContext.Provider user={currentUser}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<HomePage />} />
            <Route path="admin" element={<AdminPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
    </>
  )
}

export default App
