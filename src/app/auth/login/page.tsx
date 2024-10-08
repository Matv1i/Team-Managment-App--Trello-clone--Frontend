"use client"

import { useAppSelector } from "@/app/redux"
import { setIsLogged, setUserId } from "@/state"
import { useGetCurrentUserInfoQuery, useLoginUserMutation } from "@/state/api"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { z } from "zod"

const userSchema = z.object({
  email: z.string().email("Invalid email adress"),
  password: z.string().min(6, "Password must be at least 6 characters long  "),
})

const Login = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [teamId, setTeamId] = useState<string>("")
  const [error, setError] = useState<string | null>()
  const router = useRouter()

  const [loginUser, { isError, isLoading }] = useLoginUserMutation()

  const dispatch = useDispatch()
  const { data: user } = useGetCurrentUserInfoQuery()
  useEffect(() => {
    if (user && user.teamId) {
      setTeamId(String(user.teamId))
    }
    if (user) {
      dispatch(setUserId(user.userId))
    }
  }, [user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      userSchema.parse({ email, password })
      const response = await loginUser({
        email,
        password,
      })

      if (response?.data) {
        console.log(response.data)
        dispatch(setIsLogged(true))
        if (!teamId) {
          router.push("/searchTeams")
        } else {
          router.push("/")
        }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-primary"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-primary"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
            />
          </div>
          <div className="my-4">
            <a
              href="/auth/register"
              className="text-primary cursor-pointer hover:text-purple-900 "
            >
              Dont have a account?
            </a>
          </div>
          <div>
            <p className="text-red-600">{error}</p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2  focus:ring-opacity-75"
            onClick={handleSubmit}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
