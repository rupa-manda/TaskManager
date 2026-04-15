import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();


  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      setSuccess("Registration successful! Redirecting to login...");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Registration failed! Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account 🎉</h2>
        <p style={styles.subtitle}>Join Task Manager today</p>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <input
          style={styles.input}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleRegister}>
          Register
        </button>

        <p style={styles.link}>
          Already have an account?{" "}
          <span style={styles.linkText} onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    margin: 0,
    textAlign: "center",
    color: "#666",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    padding: "12px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
    margin: 0,
  },
  success: {
    color: "green",
    textAlign: "center",
    margin: 0,
  },
  link: {
    textAlign: "center",
    color: "#666",
    margin: 0,
  },
  linkText: {
    color: "#4f46e5",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Register;