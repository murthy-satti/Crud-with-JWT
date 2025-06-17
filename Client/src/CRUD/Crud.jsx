import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import '../App.css';
import { useNavigate } from "react-router-dom";
import { useInView } from 'react-intersection-observer';


function Crud() {
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [image, setImage] = useState(null); // File input
  const navigate = useNavigate();


  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;
  const { ref, inView } = useInView();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    Address: ''
  });

  // GET
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     navigate("/");
  //     return;
  //   }

  //   axios.get("http://localhost:3000/api/get", {
  //     headers: {
  //       Authorization: token
  //     }
  //   })
  //     .then(res => setData(res.data.allUsers))
  //     .catch(err => {
  //       if (err.response && err.response.status === 401 || 403) {
  //         alert("Session expired. Please login again.");
  //         localStorage.removeItem("token");
  //         navigate("/");
  //       } else {
  //         console.log("Fetch error:", err);
  //       }
  //     });
  // }, [reload]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios.get(`http://localhost:3000/api/get?skip=${skip}`, {
      headers: {
        Authorization: token
      }
    })
      .then(res => {
        setData(prev => {
          const newUsers = res.data.allUsers.filter(
            user => !prev.some(existing => existing._id === user._id)
          );
          return [...prev, ...newUsers];
        });
        setHasMore(res.data.hasMore);
      })
      .catch(err => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.log("Fetch error:", err);
        }
      });

  }, [skip, reload]);

  // const handleLoadMore = () => {
  //   setSkip(prev => prev + limit);
  // };

  // Auto load when scrolled to bottom
  useEffect(() => {
    if (inView && hasMore) {
      setSkip(prev => prev + limit);
    }
  }, [inView, hasMore]);


  // DELETE
  const handleDel = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/api/delete/${id}`, {
        headers: {
          Authorization: token
        }
      });

      toast.success("User deleted!");
      setReload(!reload);
    } catch (err) {
      toast.error("Delete failed");
    }
  };


  // EDIT
  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      Address: user.Address
    });
    setEditId(user._id);
    setIsEdit(true);
    setShowForm(true);
    setImage(null); // clear image input on edit
  };

  // FORM FIELD CHANGE
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // POST
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phoneNumber", formData.phoneNumber);
      fd.append("Address", formData.Address || "Not Provided");

      if (image) fd.append("image", image);
      const token = localStorage.getItem('token')
      await axios.post("http://localhost:3000/api/add", fd, {
        headers: {
          Authorization: token
        }
      });
      toast.success("User added successfully!");
      resetForm();
      setReload(!reload);
    } catch (err) {
      toast.error("Add failed");
    }
  };

  // PUT
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phoneNumber", formData.phoneNumber);
      fd.append("Address", formData.Address);
      if (image) fd.append("image", image);
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:3000/api/update/${editId}`, fd, {
        headers: {
          Authorization: token
        }
      });
      toast.success("User updated successfully!");
      setReload(!reload);
      resetForm();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phoneNumber: '', Address: '' });
    setImage(null);
    setIsEdit(false);
    setEditId(null);
    setShowForm(false);
  };

  return (
    <>
      <ToastContainer />
      <div className="w-full min-h-screen bg-gray-700 p-4">

        <div className="w-full  p-6  mb-6">
          <h2 className="text-3xl font-bold text-gray-200 mb-3">User Management System (MERN Stack Project)</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            This project is a complete user management CRUD application built using the MERN stack – MongoDB, Express.js, React.js, and Node.js.
            It enables users to create, read, update, and delete user records seamlessly with an intuitive interface. Each user profile includes details
            like <strong>name, email, phone number, address</strong>, and a <strong>profile image</strong>. Uploaded images are handled using <strong>Multer</strong> middleware and
            stored directly as binary data (Buffer) in MongoDB for easy retrieval and rendering.




            <br /><br />

            The frontend is built with <strong>React</strong> and styled using <strong>Tailwind CSS</strong>, offering a responsive layout and modern UI/UX.
            For smooth user interaction, it includes real-time toast notifications using <strong>React Toastify</strong>. The modal form supports both adding
            and editing users, with proper handling of image uploads during updates.

            <br /><br />

            This project demonstrates essential full-stack development skills including form handling, RESTful API integration, file uploads,
            authentication, error handling, pagination, and state management in React. It’s a practical and scalable solution that can be extended into larger systems like
            employee management, student records, or client databases.
          </p>

        </div>


        <div className="flex justify-around items-center">

          <h1 className="text-xl font-bold mb-4 text-white">Fetched Data:</h1>
          <button
            className='p-2 m-2 border rounded-lg bg-blue-800 text-white font-bold'
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            Add a user
          </button>
        </div>
     <div className="flex justify-center">
  <ul className="grid grid-cols-1 max-w-7xl gap-6 mx-auto p-4">
    {data.map((item, index) => (
      <li
        key={item._id}
        ref={index === data.length - 1 ? ref : null}
        className="bg-gray-500 text-black p-6 rounded-lg shadow border flex justify-between items-center w-full max-w-6xl"
      >
        <div className="flex-1 mr-12">
          <h1 className="mb-2"><strong>Name:</strong> {item.name}</h1>
          <h1 className="mb-2"><strong>Email:</strong> {item.email}</h1>
          <h1 className="mb-2"><strong>Phone:</strong> {item.phoneNumber}</h1>
          <h1 className='mb-4'><strong>Address:</strong> {item.Address}</h1>
          <div className="flex space-x-4">
            <button
              className='p-2 border rounded-lg bg-green-300 font-semibold'
              onClick={() => handleEdit(item)}
            >
              Edit
            </button>
            <button
              className='p-2 border rounded-lg bg-red-500 font-semibold'
              onClick={() => handleDel(item._id)}
            >
              Delete
            </button>
          </div>
        </div>
        <div>
          {item.image?.contentType ? (
            <img
              src={`http://localhost:3000/api/img/geti/${item._id}`}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
              N/A
            </div>
          )}
        </div>
      </li>
    ))}
  </ul>
</div>





        {/* <div className="flex justify-center">
          {hasMore &&
            <button
              className="p-2 m-2 border rounded-lg bg-blue-500 font-semibold"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          }
        </div> */}


        {showForm && (
          <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
            <form
              className="bg-gray-400 p-4 rounded-lg shadow-md w-full max-w-md mx-auto"
              onSubmit={isEdit ? handleSubmitEdit : handleSubmitAdd}
              encType="multipart/form-data"
            >
              <label className="text-black font-semibold">Name:</label>
              <input
                type="text"
                name="name"
                className="w-full p-2 m-2 rounded border bg-gray-200"
                placeholder="Enter the Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label className="text-black font-semibold">Email:</label>
              <input
                type="email"
                name="email"
                className="w-full p-2 m-2 rounded border bg-gray-200"
                placeholder="Enter the Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label className="text-black font-semibold">Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                className="w-full p-2 m-2 rounded border bg-gray-200"
                placeholder="Enter the Mobile number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />

              <label className="text-black font-semibold">Address:</label>
              <input
                type="text"
                name="Address"
                className="w-full p-2 m-2 rounded border bg-gray-200"
                placeholder="Enter the address"
                value={formData.Address}
                onChange={handleChange}
              />

              <label className="text-black font-semibold">Upload Image:</label>
              <input
                type="file"
                name="image"
                className="border p-2 m-2 bg-gray-200 rounded"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
              />

              <div className="flex justify-evenly">
                <button
                  type="button"
                  className="bg-red-600 m-2 p-2 rounded-lg font-semibold text-white"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-300 m-2 p-2 rounded-lg font-semibold"
                >
                  {isEdit ? "Update" : "Add"} User
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default Crud;
