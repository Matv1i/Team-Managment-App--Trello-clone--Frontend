import Modal from "@/components/Modals/Modal"
import {
  useCreateTeamMutation,
  useEditTeamMutation,
  useGetCurrentUserInfoQuery,
  useGetUsersByTeamIdQuery,
} from "@/state/api"
import React, { useEffect, useState } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
  teamId?: string
  teamNameEdit?: string
  projectManagerUserIdEdit?: string
}

const ModalNewTeam = ({
  isOpen,
  onClose,
  teamId,
  teamNameEdit,
  projectManagerUserIdEdit,
}: Props) => {
  const [teamName, setTeamName] = useState("")
  const [projectManagerUserId, setProjectManagerUserId] = useState("")
  const [] = useState("")
  const { data: user } = useGetCurrentUserInfoQuery()

  const [createTeam, { isLoading }] = useCreateTeamMutation()
  const [editTeam] = useEditTeamMutation()

  const { data: users } = useGetUsersByTeamIdQuery(user?.teamId || "", {
    skip: !user?.teamId,
  })

  useEffect(() => {
    if (teamId && teamNameEdit && projectManagerUserIdEdit) {
      setTeamName(teamNameEdit)
      setProjectManagerUserId(projectManagerUserIdEdit)
    }
  }, [projectManagerUserIdEdit, teamId, teamNameEdit])

  const handleSubmit = async () => {
    if (teamName === "") {
      return alert("Fiels should be filed")
    }

    if (!teamId) {
      console.log(teamName)
      console.log(user?.userId)
      console.log(user?.userId)

      const newTeam = await createTeam({
        teamName,
        productOwnerUserId: user?.userId,
        projectManagerUserId: user?.userId,
      })
      if (newTeam.data) {
        onClose()
      } else {
        return alert("Something went wrong")
      }
    } else {
      const newTeam = await editTeam({
        id: teamId,
        teamName,
        projectManagerUserId,
      })
      if (newTeam.data) {
        onClose()
      }
    }
  }

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none"

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create your own Team">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />

        {teamId ? (
          <select
            className={inputStyles}
            value={projectManagerUserId}
            onChange={(e) => setProjectManagerUserId(e.target.value)}
          >
            <option value="">Select a user</option>
            {users?.map((user) => (
              <option
                key={user.userId}
                className={inputStyles}
                value={user.userId}
              >
                {user.username}
              </option>
            ))}
          </select>
        ) : (
          <p>
            You are manager of Team. Lately You can change this in settings!
          </p>
        )}

        <button
          type="submit"
          className={`mt-4 flex justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-bg-blue-600 `}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>
    </Modal>
  )
}

export default ModalNewTeam
