import  { useState } from "react";
import axios from 'axios';
import { ToastContainer,toast } from "react-toastify";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [toEmail, setToEmail] = useState('');
  const [verifyOtp , setVerifyOtp] = useState('')

  const handleSendOtp = async () => {
    const randomOtp = Math.floor(1000 + Math.random() * 9000);
    setOtp(randomOtp); 

    try {
      const res = await axios.post('http://localhost:3000/send/otp', { toEmail, otp: randomOtp });
      toast.success(`OTP sent successfully to ${toEmail}`)
      setVerifyOtp(res.data.otp)
    } catch (err) {
      toast.error("Failed to send OTP")
      console.log("Error occured", err);
      
    }
  };

  const verify = ()=>{
    otp == verifyOtp
     ? toast.success("Otp success")
     : toast.error(" OTPFailed");
      
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <ToastContainer/>
      <div className="bg-white p-8 rounded shadow-md w-80 space-y-4">
        <h2 className="text-2xl font-semibold text-center text-blue-600">Email OTP Verification</h2>

        <input type="email" placeholder="Enter Email"
          className="w-full border p-2 rounded"
          onChange={(e) => setToEmail(e.target.value)}
        />
        <button onClick={handleSendOtp} className="w-full bg-blue-500 text-white p-2 rounded">
          Send OTP
        </button>

        <input type="text" placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button className="w-full bg-green-500 text-white p-2 rounded" onClick={verify}>
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default Otp;
