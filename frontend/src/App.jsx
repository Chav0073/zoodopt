import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from "./pages/Auth/RegisterUserPage";
import LoginUserPage from "./pages/Auth/LoginUserPage";
import AdoptPetPage from "./pages/Pets/AdoptPetPage";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginUserPage />} />
          <Route path="pets/adopt/:id" element={<AdoptPetPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
