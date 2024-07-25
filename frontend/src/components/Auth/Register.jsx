import React, { useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import '../../CSS/auth.css';
import axios from 'axios';
import { Context, server } from '../../main';
import toast from 'react-hot-toast';

const Signup = () => {

  const {isAuth, setIsAuth, loading, setLoading} = useContext(Context);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [encodedPic, setEncodedPic] = useState();
  const [yardID, setYardID] = useState("");

  const handlePic = async (pic) => {
    if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
      EncodeImage(pic);
    } else {
      setIsAuth(false)
      toast.error("Add png or jpg format");
    }
  }

  const EncodeImage = (pic) => {
    const reader = new FileReader();
    reader.readAsDataURL(pic);
    reader.onloadend = () => {
      const newEncodedPic = reader.result;
      setEncodedPic(newEncodedPic);
      uploadImage(newEncodedPic);
    }
  }

  const uploadImage = async (encodedPic) => {
    try {
      const { data } = await axios.post(
        `${server}/user/register/profilePic/upload`, 
        { data: encodedPic}, 
        { headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      toast.success(data.message)
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${server}/user/register`, {
        name,
        email,
        password,
        yardID: yardID,
        data: encodedPic
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      })
      toast.success(data.message)
      setIsAuth(true);
      setLoading(true);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Display the error message with toast
      toast.error(errorMessage);
      setIsAuth(false);
      setLoading(false);
    }
  }

  if (isAuth) return <Navigate to={'/login'} />
  
  return (
    <div className="body">
      <div className="box box-signup">
        <div className="box__form">
          <form onSubmit={handleSubmit} >
            <h2 className="form__h2">Sign up </h2>

            <div className="form__inputBox">
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                type="text" 
                id="username" 
                autoComplete="on" 
                required 
                autoFocus />
              <label htmlFor="username">Username</label>
              <i></i>
            </div> 

            <div className="form__inputBox">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                id="email" 
                autoComplete="on" 
                required />
              <label htmlFor="email">Email</label>
              <i></i>
            </div> 

            <div className="form__inputBox">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                id="password" 
                required />
              <label htmlFor="password">Password</label>
              <i></i>
            </div>

            <div className="form__inputBox">
              <input
                value={yardID}
                onChange={(e) => setYardID(e.target.value)} 
                type="text" 
                id="yardID" 
                required />
              <label htmlFor="yardID">YardID</label>
              <i></i>
            </div>

            <div className="form__inputBox no-bg">
              <input
                onChange={(e) => handlePic(e.target.files[0])} 
                type="file" 
                id="file"
                accept='image/*' />
            </div>
            
            <div className="form__links-signup">
              <Link to="/login"> Already having account? </Link>
            </div>
            
            <button disabled={loading} type="submit"> Signup </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup;