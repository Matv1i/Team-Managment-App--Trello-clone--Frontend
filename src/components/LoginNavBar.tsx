"use client"
import { useAppSelector } from "@/app/redux"
import { setIsLogged, setUserId } from "@/state"
import {
  useDeleteCookiesMutation,
  useGetCurrentUserInfoQuery,

} from "@/state/api"
import { LogOut, User } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const LoginNavBar = () => {
  const [openLogin, setOpenLogin] = useState(false)
  const [username, setUsername] = useState<string | undefined>(undefined)
  const dispatch = useDispatch()
  const isLogged = useAppSelector((state) => state.global.isLogged)

  const [deleteCookies] = useDeleteCookiesMutation()

  const { data: user } = useGetCurrentUserInfoQuery()

  useEffect(() => {
    if (user) {
      setUsername(user?.username)
      dispatch(setUserId(user.userId))
    }
  }, [user, dispatch, isLogged])

  const handleLogout = async (e: React.FormEvent) => {
    await deleteCookies()
    dispatch(setUserId(""))
    dispatch(setIsLogged(false))
    setUsername(undefined)
    window.location.reload()
  }

  return (
    <>
      {username === undefined ? (
        <User className="dark:text-white" />
      ) : (
        <p className="text-xl dark:text-white font-semibold">{username}</p>
      )}

      <div className="py-2 px-2 bg-blue-600 rounded-lg text-white cursor-pointer">
        {username === undefined ? (
          <Link href="/auth/login">Login</Link>
        ) : (
          <LogOut onClick={handleLogout} className="cursor-pointer" />
        )}
      </div>
    </>
  )
}

export default LoginNavBar
