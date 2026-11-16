import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRegisterOrganizationMutation } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterOrganizationMutation();

  const [form, setForm] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    mobile: "",
    password: "",
  });

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register({
        company_name: form.company_name.trim(),
        contact_person: form.contact_person.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim() || undefined,
        password: form.password,
      }).unwrap();

      toast.success("Registration submitted! Awaiting super admin approval.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">
          Register Your Organization
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Your request will be reviewed by a super admin before activation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            {
              k: "company_name",
              label: "Company Name",
              type: "text",
              ph: "Acme Corp",
              ac: "organization",
            },
            {
              k: "contact_person",
              label: "Contact Person",
              type: "text",
              ph: "Jane Doe",
              ac: "name",
            },
            {
              k: "email",
              label: "Email Address",
              type: "email",
              ph: "admin@acme.com",
              ac: "username",
            },
            {
              k: "mobile",
              label: "Mobile (optional)",
              type: "tel",
              ph: "+1 555 0100",
              ac: "tel",
            },
            {
              k: "password",
              label: "Password",
              type: "password",
              ph: "Min 8 characters",
              ac: "new-password",
            },
          ].map(({ k, label, type, ph, ac }) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={type}
                required={k !== "mobile"}
                minLength={k === "password" ? 8 : undefined}
                value={(form as any)[k]}
                onChange={set(k as keyof typeof form)}
                placeholder={ph}
                autoComplete={ac}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
