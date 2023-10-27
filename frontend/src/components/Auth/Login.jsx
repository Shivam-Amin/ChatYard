import React, { useContext, useEffect, useState } from 'react';
import '../../CSS/auth.css';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Context, server } from '../../main';
import Loading from '../Loading';

const Login = () => {

  const {isAuth, setIsAuth, loading, setLoading} = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Regular expression pattern for a valid email address
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Test the email against the pattern
    if (!emailPattern.test(email)) {
      toast.error("Type a correct email address...");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(`${server}/user/login`, JSON.stringify({
        email,
        password,
      }), {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,  
      })
      toast.success(data.message);
      setIsAuth(true);
      setLoading(false);

    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuth(false);
      setLoading(false);
    }
  }

  if (isAuth) return <Navigate to={'/'} />

  
  return (
    <div className="body">
      <div className="box">
        <div className="box__form">
          <form onSubmit={handleSubmit}>
            <h2 className="form__h2">Login </h2>
            <div className="form__inputBox">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                type="text" 
                id="email" 
                autoComplete="on" 
                autoFocus
                required />
              <label htmlFor="text">Email</label>
            </div> 

            <div className="form__inputBox">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                id="password" 
                required />
              <label htmlFor="password">Password</label>
            </div>
            
            <div className="form__links">
              <a href="/">Forgot Password</a>
              <Link to="/register"> Signup </Link>
              <i></i>
            </div>
            
            <button disabled={loading} type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;