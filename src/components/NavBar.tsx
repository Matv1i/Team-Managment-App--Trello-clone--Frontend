import { useAppDispatch, useAppSelector } from "@/app/redux"
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state"
import {
  LucideIcon,
  Menu,
  Moon,
  Search,
  Settings,
  Sidebar,
  Sun,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"
import { useDispatch } from "react-redux"
import LoginNavBar from "./LoginNavBar"

const Navbar = () => {
  const dispatch = useAppDispatch()

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  )
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
      <div className="flex items-center gap-8 ">
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          >
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-1.5 ">
        <button
          className={
            isDarkMode
              ? `rounded p-2 dark:hover:bg-gray-700`
              : `rounded p-2 hover:bg-gray-100`
          }
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
          ) : (
            <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
          )}
        </button>
        <Link
          href="/settings"
          className={
            isDarkMode
              ? `rounded p-2 dark:hover:bg-gray-700`
              : `rounded p-2 hover:bg-gray-100`
          }
        >
          <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
        </Link>
        <LoginNavBar />
      </div>
    </div>
  )
}
export default Navbar
