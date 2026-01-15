import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/app", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-md">
          <div className="card bg-base-100 border border-base-content/10">
            <div className="card-body">
              <h1 className="card-title text-2xl">Log in</h1>
              <p className="text-sm opacity-70">Welcome back.</p>

              <form className="mt-4 space-y-3" onSubmit={onSubmit}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    autoComplete="email"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    autoComplete="current-password"
                  />
                </div>

                {error ? <div className="alert alert-error py-2 text-sm">{error}</div> : null}

                <button className="btn btn-primary w-full">Log in</button>
              </form>

              <p className="mt-4 text-sm opacity-70">
                No account?{" "}
                <Link to="/register" className="link link-hover">
                  Register
                </Link>
              </p>

              <Link to="/" className="btn btn-ghost w-full mt-3">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
