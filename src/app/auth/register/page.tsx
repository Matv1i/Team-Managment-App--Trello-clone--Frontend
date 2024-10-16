"use client"

import { useCreateUserMutation } from "@/state/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { z } from "zod"

const userSchema = z.object({
  username: z.string().min(3, "Username is required"),
  email: z.string().email("Invalid email adress"),
  password: z.string().min(6, "Password must be at least 6 characters long  "),
})

const Register = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [error, setError] = useState<string | null>()
  const router = useRouter()
  const [createUser, { isLoading, isError, status }] = useCreateUserMutation()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      userSchema.parse({ username, email, password })
      const response = await createUser({
        username,
        email,
        password,
        profilePictureUrl,
      })

      if (response?.data) {
        router.push("/")
      } else if ("error" in response) {
        alert("Seomthing went wrong")
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors.map((err) => err.message).join(", "))
      } else {
        setError("Something went wrong. ")
      }
    }
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-dark-secondary">
      <div className=" w-full max-w-md bg-white p-8 rounded-lg shadow-lg dark:bg-dark-bg">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
          Register
        </h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 mb-2 dark:text-white"
            >
              Email
            </label>
            <input
              value={email}
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-primary"
              required
              onChange={(e) => setEmail(e.target.value.trim())}
            />
            <div className="pt-2">
              <p className="text-red-600 font-semibold">
                {error?.includes("email") ? "Invalid email adress" : null}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="profilePricture"
              className="block text-gray-700 mb-2 dark:text-white"
            >
              Url of avatar
            </label>
            <input
              value={profilePictureUrl}
              type="text"
              id="profilePricture"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-primary"
              required
              onChange={(e) => setProfilePictureUrl(e.target.value.trim())}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 mb-2 dark:text-white"
            >
              Username
            </label>
            <input
              value={username}
              type="username"
              id="username"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-primary"
              required
              onChange={(e) => setUsername(e.target.value.trim())}
            />
            <div className="pt-2">
              <p className="text-red-600 font-semibold ">
                {error?.includes("Username")
                  ? "Username must be at least 3 characters long"
                  : null}
              </p>
            </div>
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-gray-700 mb-2 dark:text-white"
            >
              Password
            </label>
            <input
              value={password}
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-primary"
              required
              onChange={(e) => setPassword(e.target.value.trim())}
            />
            <div className="pt-2">
              <p className="text-red-600 font-semibold">
                {error?.includes("Password")
                  ? "Username must be at least 3 characters long"
                  : null}
              </p>
            </div>
          </div>
          <div className="my-4">
            <Link
              href="/auth/login"
              className="text-primary cursor-pointer 
               dark:text-white hover:text-blue-600 dark:hover:text-blue-600 "
            >
              I already have an account
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2  focus:ring-opacity-75"
            onClick={handleSubmit}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
