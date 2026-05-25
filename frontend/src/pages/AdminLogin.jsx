import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero";
import { loginAdmin } from "../services/api";
import { setAdminToken } from "../utils/adminAuth";

const inputClass =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      const response = await loginAdmin({
        username,
        password
      });

      setAdminToken(response.token);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHero
        eyebrow="Secure Admin Access"
        title="Admin Login"
        description="Sign in to access response analytics, export data, and review screening outcomes."
        asideTitle="Protected Area"
        asideDescription="Only authenticated administrators can access dashboard, responses, statistics, and export tools."
      />

      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-panel">
        <div className="space-y-6">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={inputClass}
              autoComplete="username"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="text-sm text-danger">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default AdminLogin;
