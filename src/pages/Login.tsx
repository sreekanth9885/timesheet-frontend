import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useLoginMutation, api } from "../services/api";
import { setCredentials } from "../features/auth/authSlice";
import type { User } from "../types";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();

      const { token, user } = response.data;

      // ✅ Annotated so TS keeps the literal union (no widening to `string`)
      const role: User["role"] =
        user.role_id === 1
          ? "super_admin"
          : user.role_id === 2
            ? "admin"
            : "employee";

      // ✅ Annotated so the whole object matches `User`
      const normalizedUser: User = {
        ...user,
        name:
          `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
          user.email,
        role,
      };

      dispatch(api.util.resetApiState());
      dispatch(setCredentials({ user: normalizedUser, token }));

      toast.success(`Welcome back, ${normalizedUser.name}!`);

      navigate(
        role === "super_admin" ? "/super-admin/organizations" : "/dashboard",
      );
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Timesheet System
          </h1>
          <p className="text-sm text-gray-500">
            Sign in with your email and password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register your organization
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
