import { Button, Label, TextInput } from "flowbite-react";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { LoginSchema } from "../../Schema/AuthSchema";
import AppAlert from "../../Components/AppAlert/AppAlert";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function Login() {
  const [msg, setmsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function sendlogindata(values) {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        values,
      );

      if (data.success === true) {
        setmsg(data.message);
        setIsSuccess(true);

        const newToken = data.data.token;

        localStorage.setItem("token", newToken);
        setToken(newToken);

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      setmsg(err.response?.data?.message || "Login failed");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
<>
  <title>Login</title>

  <div className="min-h-screen grid md:grid-cols-2">

    {/* Left Side */}
    <div className="hidden md:flex flex-col justify-center items-start bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 text-white p-16">

      <h1 className="text-6xl font-extrabold mb-4">MUNC</h1>

      <p className="text-lg mb-8 opacity-90">
        Welcome Too
      </p>

      <div className="space-y-4 max-w-md text-blue-50">

        <p className="text-lg font-semibold">
          Connect with friends and share your moments.
        </p>

        <p>
          Discover posts, interact with the community, and stay updated with everything happening around you.
        </p>

        <p>
          Join thousands of fans and start sharing your story today.
        </p>

      </div>

    </div>

    {/* Right Side */}
    <div className="flex items-center justify-center bg-gray-100 p-6">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <form onSubmit={handleSubmit(sendlogindata)} className="space-y-6">

          <div>
            <Label htmlFor="email1" className="block text-gray-700 font-semibold mb-2">
              Email Address
            </Label>

            <TextInput
              {...register("email")}
              id="email1"
              type="email"
              placeholder="your@email.com"
              className="rounded-xl"
            />

            {errors.email && (
              <AppAlert color="failure" content={errors.email.message} />
            )}
          </div>

          <div>
            <Label htmlFor="password1" className="block text-gray-700 font-semibold mb-2">
              Password
            </Label>

            <TextInput
              id="password1"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="rounded-xl"
            />

            {errors.password && (
              <AppAlert color="failure" content={errors.password.message} />
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          {msg && (
            <AppAlert
              color={isSuccess ? "success" : "failure"}
              content={msg}
            />
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-500">OR</span>
            </div>
          </div>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign Up
            </Link>
          </p>

        </form>

      </div>

    </div>

  </div>
</>
  );
}