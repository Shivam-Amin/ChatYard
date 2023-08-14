import React, { useContext, useState } from 'react';
import '../CSS/auth.css';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Context, server } from '../main';

const Login = () => {

  const {isAuth, setIsAuth, loading, setLoading} = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('hoga..');

      const { data } = await axios.post(`${server}/user/login`, {
        email,
        password,
        pic
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      })
      // toast.success('Ho gaya!');
      // console.log('hoga..');
      setIsAuth(true)
      setLoading(false);
      // console.log(data);
    } catch (error) {
      toast.error(error.response.data.message);
      // console.log(error.message);
      setIsAuth(false)
      setLoading(false);
    }
  }

  if (isAuth) return <Navigate to={'/'} />

  return (
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
  )
}

export default Login;