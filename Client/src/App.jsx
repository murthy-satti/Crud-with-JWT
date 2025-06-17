import Crud from "./CRUD/Crud";
import Login from "./LoginRegister/Login";
import { Routes, Route, Link } from "react-router-dom";
import Register from "./LoginRegister/Register";
import ProtectedRoute from "./LoginRegister/Protescted";
import Otp from "./LoginRegister/nodemailer";



function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp/>}/>
        <Route path="/crud" element={
          <ProtectedRoute> <Crud /></ProtectedRoute>} />
      </Routes>

    </>
  );
}

export default App;
