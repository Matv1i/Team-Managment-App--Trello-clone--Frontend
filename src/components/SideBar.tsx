"use client"
import React from "react"
import { useState } from "react"
import Image from "next/image"
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  HomeIcon,
  Layers,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useDispatch } from "react-redux"
import { useAppSelector } from "@/app/redux"
import Link from "next/link"
import { Home } from "lucide-react"
import isSideBarCollapsed, { setIsSidebarCollapsed } from "@/state/index"

import { useGetProjectsQuery } from "@/state/api"

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true)
  const [showPriority, setShowPriority] = useState(true)

  const dispatch = useDispatch()
  const isSideBarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  )

  const { data: projects } = useGetProjectsQuery()

  const sidebarClassnames = `fixed flex flex-col  h-full 
  justify-between shadow-xl transition-all duration-300 h-full z-40 dark:bg-black overflow-x-hidden bg-white ${isSideBarCollapsed ? "w-0 hidden" : "w-64"} `
  return (
    <div className={`${sidebarClassnames} overflow-y-auto`}>
      <div className="flex h-[100%] w-full flex-col justify-start ">
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            EDLIST
          </div>
          {isSideBarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() =>
                dispatch(setIsSidebarCollapsed(!isSideBarCollapsed))
              }
            >
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700 ">
          <Image
            src="https://pm-s3-bucket-12er3te.s3.eu-north-1.amazonaws.com/logo.webp"
            alt="logo"
            width={40}
            height={40}
          />
          <div>
            <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
              EDROH TEAM
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Private</p>
            </div>
          </div>
        </div>
        <nav className="z-10 w-full">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="TimeLine" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />

          <button
            className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
            onClick={() => setShowProjects((prev) => !prev)}
          >
            <span className="">Projects</span>
            {showProjects ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {showProjects &&
            projects?.map((project) => (
              <SidebarLink
                key={project.id}
                icon={Briefcase}
                label={project.name}
                href={`/projects/${project.id}`}
              />
            ))}
          <button
            className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
            onClick={() => setShowPriority((prev) => !prev)}
          >
            <span className="">Priority</span>
            {showPriority ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {showPriority && (
            <>
              <SidebarLink
                icon={AlertCircle}
                label="Urgent"
                href="/priority/urgent"
              />
              <SidebarLink
                icon={AlertTriangle}
                label="High"
                href="/priority/high"
              />
              <SidebarLink
                icon={AlertOctagon}
                label="Medium"
                href="/priority/medium"
              />
              <SidebarLink
                icon={ShieldAlert}
                label="Low"
                href="/priority/low"
              />
              <SidebarLink
                icon={Layers}
                label="Backlog"
                href="/priority/backlog"
              />
            </>
          )}
        </nav>
      </div>
    </div>
  )
}

interface SidebarProps {
  href: string
  icon: LucideIcon
  label: string
  isCollapsed?: boolean
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarProps) => {
  const pathname = usePathname()
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard")
  const screenWidth = window.innerWidth

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${isActive ? "bg-gray-100 text-white dark:bg-gray-600" : null} justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
        )}
        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />

        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
          {label}
        </span>
      </div>
    </Link>
  )
}

export default Sidebar
