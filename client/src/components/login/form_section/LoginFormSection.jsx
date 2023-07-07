import React from "react";
import styles from './LoginFormSection.module.css'
import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormSection() {
  const emailRef = useRef();
  const passRef = useRef();
  const [errorMsg, setErrorMsg] = useState();

  const navigate = useNavigate();

  return (
    <div className={styles.formSection}>
      <div className={styles.formHeading}>
        <h1>Already have an account?</h1>
        <span>Your personal job finder is here</span>
      </div>

      {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log(process.env.REACT_APP_BASE_URL)
          let res = await axios.post(process.env.REACT_APP_BASE_URL +  "/login", {
            email: emailRef.current.value,
            password: passRef.current.value,
          });
          
          switch(res.data.status){
            case 200:
              localStorage.setItem(
                "data",
                JSON.stringify({
                  name: res.data.name,
                  jwtToken: res.data.jwtToken,
                })
              );
              navigate("/");
              break;    
            case 401:
              setErrorMsg("Invalid creadentials, Please Try again");
              break;
            default:
              setErrorMsg("Something went wrong, Please Try again later");
          }
        }
      }
        className={styles.loginForm}
      >
        <input
          placeholder="Email"
          type="email"
          required
          name="email"
          ref={emailRef}
        />
        <input
          placeholder="Password"
          type="password"
          required
          name="password"
          ref={passRef}
        />
        <button type="submit">Sign in</button>
      </form>
      <div>
        Don’t have an account?{" "}
        <b>
          <u>
            <a href="./register">Sign Up</a>
          </u>
        </b>
      </div>
    </div>
  );
}
