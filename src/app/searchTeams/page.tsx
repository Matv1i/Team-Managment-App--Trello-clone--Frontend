"use client"
import TeamCard from "@/components/Cards/TeamCard"
import { useGetCurrentUserInfoQuery, useSearchTeamsQuery } from "@/state/api"

import { debounce } from "lodash"
import React, { useEffect, useState } from "react"
import { ring } from "ldrs"
import { useAppSelector } from "../redux"
import { PlusIcon } from "lucide-react"
import ModalNewTeam from "@/components/Modals/ModalNewTeam"

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [userTeamid, setUserTeamId] = useState<string | undefined>(undefined)
  const [openModal, setOpenModal] = useState(false)




  const { data: user } = useGetCurrentUserInfoQuery(undefined, {
    refetchOnFocus: true,
  })

  useEffect(() => {
    if (user) {
      setUserTeamId(user.teamId)
    }
  }, [user])

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchTeamsQuery(searchTerm, {
    skip: searchTerm.length < 3,
  })

  console.log(searchResults)

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value)
    },
    500
  )

  useEffect(() => {
    setUserTeamId(user?.teamId)
    return handleSearch.cancel
  }, [handleSearch])

  if (isError) {
    return (
      <div className="text-red-500 text-lg font-semibold">
        Error occurred while fetching teams
      </div>
    )
  }

  return (
    <div className="dark:bg-dark-secondary h-full flex flex-col justify-start items-center bg-gray-50 py-10">
      <div
        onClick={() => setOpenModal(true)}
        className="cursor-pointer fixed px-3 leading-0 py-3 text-2 text-white
      xl font-bold bg-blue-600 rounded-full right-7 bottom-6"
      >
        <PlusIcon size={27} />
      </div>
      <div className="text-center w-full">
        <h1 className="dark:text-white text-4xl font-bold text-gray-800 mb-8">
          Find your team
        </h1>
        <p className="text-lg dark:text-white text-gray-600 mb-6">
          Search by team name or ID
        </p>
        <input
          type="text"
          placeholder="Enter team name or ID"
          className="w-96 h-12 rounded-lg border border-gray-300 px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleSearch}
        />
      </div>
      <div className="w-full px-5 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        { searchResults &&
          Array.isArray(searchResults) &&
          searchResults.length > 0 ? (
          searchResults.map((team) => (
            <TeamCard
              userId={user?.userId}
              userTeamId={userTeamid}
              teamId={team.id}
              key={team.id}
              teamName={team.teamName}
              userCount={team.userCount}
              projectManager={team.projectManager}
            />
          ))
        ) : (
          <div className="text-center w-full mt-10">
            <p className="text-lg text-gray-600">
              No teams found. Try searching for another team.
            </p>
          </div>
        )}
      </div>
      {openModal && (
        <ModalNewTeam isOpen={openModal} onClose={() => setOpenModal(false)} />
      )}
    </div>
  )
}

export default Page
