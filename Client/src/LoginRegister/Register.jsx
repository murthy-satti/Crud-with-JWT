import React, { useState } from "react";
import { User, Mail, Phone, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';


export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
    const navigate = useNavigate()
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/reg/new', form)
            localStorage.setItem("token", response.data.token);// store token

            toast.success("User registered succesfully")
            navigate('/crud')

        } catch (error) {
            console.log("Error occured", error);
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
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center border rounded p-2">
                        <User className="w-5 h-5 mr-2 text-gray-500" />
                        <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Name" className="w-full outline-none" required />
                    </div>
                    <div className="flex items-center border rounded p-2">
                        <Mail className="w-5 h-5 mr-2 text-gray-500" />
                        <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" className="w-full outline-none" required />
                    </div>
                    <div className="flex items-center border rounded p-2">
                        <Phone className="w-5 h-5 mr-2 text-gray-500" />
                        <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="Phone" className="w-full outline-none" required />
                    </div>
                    <div className="flex items-center border rounded p-2">
                        <Lock className="w-5 h-5 mr-2 text-gray-500" />
                        <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" className="w-full outline-none" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Register</button>
                    <p className="text-center text-sm mt-2">
                        Already have an account? <Link to="/" className="text-blue-500">Login</Link>
                    </p>
                </form>
            </div>
        </div>

    );
}
