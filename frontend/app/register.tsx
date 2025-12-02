"use client";

import { useState } from "react";
import { registerUser } from "../lib/api"; // your axios module

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await registerUser(username, email, password1, password2);
      localStorage.setItem("token", data.key);
      setMessage("Registered successfully!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password1} onChange={e => setPassword1(e.target.value)} />
        <input placeholder="Confirm Password" type="password" value={password2} onChange={e => setPassword2(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      <div style={{ marginTop: 12 }}>
        <p>Or register with:</p>
        <a href={`${process.env.NEXT_PUBLIC_API_URL_ROOT || "http://localhost:8000"}/accounts/google/login/`}>
          <button type="button">Register with Google</button>
        </a>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
