"use client";

import { useState } from "react";
import { loginUser } from "../lib/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.key);
      router.push("/dashboard");
    } catch (err: any) {
      setMessage(err.response?.data?.non_field_errors?.[0] || "Login failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <div style={{ marginTop: 12 }}>
        <p>Or sign in with:</p>
        <a href={`${process.env.NEXT_PUBLIC_API_URL_ROOT || "http://localhost:8000"}/accounts/google/login/`}>
          <button type="button">Sign in with Google</button>
        </a>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
