import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const e = {};

    if (!form.username?.trim()) e.username = "Username is required";
    if (!form.password?.trim()) e.password = "Password is required";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters long";

    setError(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error[name]) setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { message } = await login(form);
      if (message) console.info(message);
      navigate("/table");
    } catch (err) {
      const msg =
        err.status === 500
          ? "Invalid username or password"
          : err.status === 403
          ? "Access Denied."
          : err.status === 0
          ? "Server error. Please try again later."
          : err.message || "Login failed. Please try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        {serverError && <p>{serverError}</p>}

        <div>
          <label>
            Username
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
              autoComplete="username"
            />
          </label>
          {error.username && <p>{error.username}</p>}
        </div>

        <div>
          <label>
            Password
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
            />
          </label>

          <label style={{ display: "block", marginTop: "4px" }}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              disabled={loading}
            />
            Show Password
          </label>

          {error.password && <p>{error.password}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </>
  );
}

export default Login;
