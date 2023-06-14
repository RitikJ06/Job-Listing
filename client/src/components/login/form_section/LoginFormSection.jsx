import React from "react";
import "./LoginFormSection.css";
import axios from 'axios';
import { useRef } from "react";
import { useNavigate } from 'react-router-dom'

export default function FormSection() {
  const emailRef = useRef();
  const passRef = useRef();
  const errRef = useRef();
  
  const navigate = useNavigate();

  return (
    <div className="formSection">
      <div className="formHeading">
        <h1>Already have an account?</h1>
        <span>Your personal job finder is here</span>
      </div>

      <div className="errorMessage" ref={errRef}></div>
      <form onSubmit={ async (e) => {
        e.preventDefault()
        let res = await axios.post('http://localhost:8000/login', {
          email: emailRef.current.value,
          password: passRef.current.value
        })

        if(res.data.status === 200){
          console.log(res.data.name)
          localStorage.setItem('data', JSON.stringify({name: res.data.name, jwtToken: res.data.jwtToken}));
          navigate('/');
        }
        else if(res.data.status === 401){
          errRef.current.innerHTML = "Invalid creadentials, Please Try again";
          errRef.current.style.display = "block"
        }
        else{
          errRef.current.innerHTML = "Something went wrong, Please Try again later";
          errRef.current.style.display = "block"
        }
        
      }} className="loginForm">
        <input placeholder="Email" type="email" required name="email" ref={emailRef} />
        <input placeholder="Password" type="password" required name="password" ref={passRef}/>
        <button type="submit">Sign in</button>
      </form>
      <div>Don’t have an account? <b><u><a href="./register">Sign Up</a></u></b></div>
    </div>
  );
}
