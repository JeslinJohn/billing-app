import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";

const ROLE_OPTIONS = ["USER", "ADMIN"];

function Register() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: ROLE_OPTIONS[0]
  });

  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const e = {};
    if (!form.firstname?.trim()) e.firstname = "First name is required";
    if (!form.lastname?.trim()) e.lastname = "Last name is required";
    if (!form.email?.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Email address is invalid";
    if (!form.username?.trim()) e.username = "Username is required";
    if (!form.password?.trim()) e.password = "Password is required";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters long";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!form.role) e.role = "Role is required";
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
      const payload = {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        role: form.role
      };
      const { message } = await register(payload);
      if (message) console.info(message);
      navigate("/table");
    } catch (err) {
      const msg =
        err.status === 400
          ? "Invalid data provided."
          : err.status === 409
          ? "Username or email already exists."
          : err.status === 0
          ? "Server error. Please try again later."
          : err.status === 403
          ? "Access Denied."
          : err.message || "Registration failed. Please try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
          margin: "0 auto"
        }}
      >
        <h2>Register</h2>

        {serverError && <div style={{ color: "red" }}>{serverError}</div>}

        <input
          placeholder="First Name"
          name="firstname"
          value={form.firstname}
          onChange={handleChange}
        />
        {error.firstname && (
          <span style={{ color: "red" }}>{error.firstname}</span>
        )}

        <input
          placeholder="Last Name"
          name="lastname"
          value={form.lastname}
          onChange={handleChange}
        />
        {error.lastname && (
          <span style={{ color: "red" }}>{error.lastname}</span>
        )}

        <input
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        {error.email && <span style={{ color: "red" }}>{error.email}</span>}

        <input
          placeholder="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
        />
        {error.username && (
          <span style={{ color: "red" }}>{error.username}</span>
        )}

        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />
            Show Password
          </label>
        </div>
        {error.password && (
          <span style={{ color: "red" }}>{error.password}</span>
        )}

        <input
          placeholder="Confirm Password"
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {error.confirmPassword && (
          <span style={{ color: "red" }}>{error.confirmPassword}</span>
        )}

        <select name="role" value={form.role} onChange={handleChange}>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {error.role && <span style={{ color: "red" }}>{error.role}</span>}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </>
  );
}

export default Register;
