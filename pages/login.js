// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      router.push("/"); // Redirect to the home page
    } else {
      const data = await response.json();
      setError(data.message || "Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome Back</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          font-family: "Arial", sans-serif;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
          
        .login-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 400px;
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          text-align: center;
        }

        h1 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .input-group {
          margin-bottom: 1rem;
          text-align: left;
        }

        label {
          display: block;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        input {
          padding: 0.8rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          outline: none;
        }

        input:focus {
          border-color: #4facfe;
        }

        .error {
          color: red;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .login-button {
          background: #4facfe;
          color: #fff;
          font-size: 1rem;
          padding: 0.8rem;
          border: none;
          border-radius: 5px;
          width: 100%;
          cursor: pointer;
          transition: background 0.3s;
        }

        .login-button:hover {
          background: #00c1fe;
        }

        @media (max-width: 480px) {
          .login-box {
            padding: 1.5rem;
          }

          h1 {
            font-size: 1.5rem;
          }

          .login-button {
            font-size: 0.9rem;
            padding: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}
