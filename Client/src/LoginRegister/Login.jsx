import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/reg/login", form)
      localStorage.setItem("token", response.data.token);// store token
      toast.success("Login success")
      navigate("/crud")
    } catch (error) {
      console.log("errpr occured", error);
      if (error.response && error.response.data && error.response.data.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-sm bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border rounded p-2">
            <Mail className="w-5 h-5 mr-2 text-gray-500" />
            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" className="w-full outline-none" required />
          </div>
          <div className="flex items-center border rounded p-2">
            <Lock className="w-5 h-5 mr-2 text-gray-500" />
            <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" className="w-full outline-none" required />
          </div>
          {/* <Link to="/crud"> */}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" >Login</button>
          {/* </Link> */}
          <p className="text-center text-sm mt-2">
            Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
          </p>
        </form>
      </div>
    </div>

  );
}
