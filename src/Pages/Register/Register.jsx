import { Button, Label, Radio, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { RegistrationSchema } from "../../Schema/AuthSchema";
import AppAlert from "../../Components/AppAlert/AppAlert";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [msg, setmsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
  });

  async function senddata(values) {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signup",
        values,
      );

      if (data.success === true) {
        setmsg(data.message);
        setIsSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setmsg(err.response?.data?.message || "Registration failed");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
<>
  <title>Register</title>

  <div className="min-h-screen grid md:grid-cols-2 py-5">

    {/* Left Side */}
    <div className="hidden md:flex flex-col justify-center items-start bg-gradient-to-br from-indigo-400 via-blue-400 to-blue-500 text-white p-16">

      <h1 className="text-5xl font-extrabold mb-4">
        Create Account
      </h1>

      <p className="text-lg mb-8 opacity-90">
        JOIN MNUS
      </p>

      <div className="space-y-4 max-w-md text-blue-50">

        <p className="text-lg font-semibold">
          Share your thoughts with the community.
        </p>

        <p>
          Connect with fans, explore posts, and interact with people who share the same passion.
        </p>

        <p>
          Create your profile today and start your journey with us.
        </p>

      </div>

    </div>

    {/* Right Side */}
    <div className="flex items-center justify-center bg-gray-100 p-6">

      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">

        <form onSubmit={handleSubmit(senddata)} className="space-y-5">

          <div>
            <Label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-2"
            >
              Full Name
            </Label>

            <TextInput
              {...register("name")}
              id="name"
              type="text"
              placeholder="Enter your full name"
            />

            {errors.name && (
              <AppAlert color="failure" content={errors.name.message} />
            )}
          </div>

          <div>
            <Label
              htmlFor="username"
              className="block text-gray-700 font-semibold mb-2"
            >
              Username
            </Label>

            <TextInput
              {...register("username")}
              id="username"
              type="text"
              placeholder="Choose a username"
            />

            {errors.username && (
              <AppAlert color="failure" content={errors.username.message} />
            )}
          </div>

          <div>
            <Label
              htmlFor="password1"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password
            </Label>

            <TextInput
              id="password1"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />

            {errors.password && (
              <AppAlert color="failure" content={errors.password.message} />
            )}
          </div>

          <div>
            <Label
              htmlFor="rePassword"
              className="block text-gray-700 font-semibold mb-2"
            >
              Confirm Password
            </Label>

            <TextInput
              {...register("rePassword")}
              id="rePassword"
              type="password"
              placeholder="••••••••"
            />

            {errors.rePassword && (
              <AppAlert
                color="failure"
                content={errors.rePassword.message}
              />
            )}
          </div>

          <div>
            <Label
              htmlFor="dateOfBirth"
              className="block text-gray-700 font-semibold mb-2"
            >
              Date of Birth
            </Label>

            <TextInput
              {...register("dateOfBirth")}
              id="dateOfBirth"
              type="date"
              placeholder="dd/mm/yyyy"
            />

            {errors.dateOfBirth && (
              <AppAlert
                color="failure"
                content={errors.dateOfBirth.message}
              />
            )}
          </div>

          <div>
            <Label
              htmlFor="email1"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email Address
            </Label>

            <TextInput
              {...register("email")}
              id="email1"
              type="email"
              placeholder="your@email.com"
            />

            {errors.email && (
              <AppAlert color="failure" content={errors.email.message} />
            )}
          </div>

          <div>
            <p className="text-gray-700 font-semibold mb-2">
              Gender
            </p>

            <div className="flex gap-6">

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("gender")}
                  value="male"
                />
                <span className="text-gray-600">Male</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("gender")}
                  value="female"
                />
                <span className="text-gray-600">Female</span>
              </label>

            </div>

          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing up...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          {msg && (
            <AppAlert
              color={isSuccess ? "success" : "failure"}
              content={msg}
            />
          )}

        </form>

      </div>

    </div>

  </div>
</>
  );
}