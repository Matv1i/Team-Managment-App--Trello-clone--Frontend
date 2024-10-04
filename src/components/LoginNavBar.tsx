"use client"

import { useAppSelector } from "@/app/redux"
import { fetchUserInfo, setIsLogged, setUser } from "@/state"
import {
  useDeleteCookiesMutation,
  useGetCurrentUserInfoMutation,
  useGetCurrentUserInfoQuery,
} from "@/state/api"
import { LogOut, LogOutIcon, User } from "lucide-react"
import Link from "next/link"

import React, { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

export type Token = {
  id: string
  username: string
}
export type UserPartil = {
  username: string
  id: string
}

const LoginNavBar = () => {
  const [openLogin, setOpenLogin] = useState(false)

  // Fetch user info from the Redux store
  const username = useAppSelector((state) => state.global.username)
  const isLogged = useAppSelector((state) => state.global.isLogged)

  const dispatch = useDispatch()

  const { data: user } = useGetCurrentUserInfoQuery()
  useEffect(() => {
    console.log(user)
  }, [])

  // Handle user logout
  // const handleLogout = async (e: React.FormEvent) => {
  //   await deleteCookies() // Clear cookies
  //   dispatch(setIsLogged(false)) // Update logged state in Redux
  //   dispatch(setUser(null)) // Clear user in Redux
  //   window.location.reload() // Refresh the page
  // }

  return (
    <>
      {username === null ? (
        <User className="dark:text-white" />
      ) : (
        <p className="text-xl font-semibold">{username}</p>
      )}

      <div
        onClick={() => setOpenLogin(true)}
        className="py-2 px-2 bg-blue-600  rounded-lg text-white cursor-pointer  "
      >
        {username === null ? (
          <Link href="/auth/login">Login</Link>
        ) : (
          <LogOut onClick={handleLogout} />
        )}
      </div>
    </>
  )
}

export default LoginNavBar
