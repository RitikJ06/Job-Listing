import React from "react";
import "./RegisterFormSection.css";
import axios from 'axios';
// import dotenv from 'dotenv';

import { useRef } from "react";
import { useNavigate } from 'react-router-dom'

// dotenv.config();

export default function FormSection() {
  const nameRef = useRef();
  const emailRef = useRef();
  const mobileRef = useRef();
  const passRef = useRef();
  const errRef = useRef();
  
  const navigate = useNavigate();

  return (
    <div className="formSection">
      <div className="formHeading">
        <h1>Create an account</h1>
        <span>Your personal job finder is here</span>
      </div>

      <div className="errorMessage" ref={errRef}></div>
      <form onSubmit={ async (e) => {
        e.preventDefault()
        let res = await axios.post( 'http://localhost:8000/register', {
          name: nameRef.current.value,
          email: emailRef.current.value,
          mobile: mobileRef.current.value,
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
        
      }} className="registerForm">
        <input placeholder="Name" type="text" required name="name" ref={nameRef} />
        <input placeholder="Email" type="email" required name="email" ref={emailRef} />
        <input placeholder="Mobile" type="number" required name="mobile" ref={mobileRef} />
        <input placeholder="Password" type="password" required name="password" ref={passRef}/>
        <button className="createAccountButton" type="submit">Create Account</button>
      </form>
      <div>Already have an account? <b><u><a href="./login">Sign in</a></u></b></div>
    </div>
  );
}
