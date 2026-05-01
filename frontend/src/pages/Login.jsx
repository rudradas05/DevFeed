import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login({ email, password });
      } else {
        await register({ username, email, password });
        await login({ email, password });
      }

      navigate("/");
    } catch (submitError) {
      setError(submitError?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-copy" aria-label="DevFeed overview">
          <p className="section-kicker">Built for developers</p>
          <h1>Track your work and follow what other builders are shipping.</h1>
          <p>
            DevFeed keeps project updates, questions, and implementation notes in
            one focused place.
          </p>
          <div className="auth-highlights">
            <span>Clean feed</span>
            <span>Protected account</span>
            <span>Fast posting</span>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-header">
            <p className="section-kicker">
              {mode === "login" ? "Sign in" : "Create account"}
            </p>
            <h2>{mode === "login" ? "Welcome Back" : "Join DevFeed"}</h2>
            <p>
              {mode === "login"
                ? "Use your account details to continue."
                : "Create your profile and start posting."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "signup" && (
              <div className="form-field">
                <label className="form-label" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Choose your username"
                />
              </div>
            )}

            <div className="form-field">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="you@example.com"
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="error-banner" role="alert">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary btn-full">
              {loading ? (
                <span className="loading-inline">
                  <span className="spinner" aria-hidden="true" />
                  Processing...
                </span>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="auth-toggle">
            <p>
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchParams(mode === "login" ? { mode: "signup" } : {});
                setError("");
              }}
              className="link-button"
            >
              {mode === "login" ? "Sign up here" : "Sign in here"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
