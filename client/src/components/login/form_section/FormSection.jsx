import React from "react";
import "./FormSection.css";

export default function FormSection() {
  return (
    <div className="formSection">
      <div className="formHeading">
        <h1>Already have an account?</h1>
        <span>Your personal job finder is here</span>
      </div>

      <form method="POST" className="loginForm">
        <input placeholder="Email" type="email" required name="email" />
        <input placeholder="Password" type="password" required name="password" />
        <button type="submit">Sign in</button>
      </form>

      <div>Don’t have an account? <b><u><a href="./register">Sign Up</a></u></b></div>
    </div>
  );
}
