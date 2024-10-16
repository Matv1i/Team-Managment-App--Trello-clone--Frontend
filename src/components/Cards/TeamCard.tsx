"use client"
import * as React from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import CardActionArea from "@mui/material/CardActionArea"
import CardActions from "@mui/material/CardActions"
import {
  useChangeTeamMutation,
  useDeleteTeamMutation,
  useGetCurrentUserInfoQuery,
  useGetTeamByIdQuery,
} from "@/state/api"
import { useAppSelector } from "@/app/redux"
import { useDispatch } from "react-redux"

import { useRouter } from "next/navigation"
import { Edit, Ellipsis, Option, Trash } from "lucide-react"
import ModalNewTeam from "../Modals/ModalNewTeam"

type Props = {
  userId: string | undefined
  userTeamId: string | undefined
  teamName: string
  projectManager: string
  userCount: number
  teamId: string
}

export default function TeamCard({
  userId,
  userTeamId,
  teamName,
  projectManager,
  userCount,
  teamId,
}: Props) {
  const { data: user } = useGetCurrentUserInfoQuery()
  const dispatch = useDispatch()
  const [openModal, setOpenModal] = React.useState(false)
  const [changeTeam, { isError, isSuccess, isLoading }] =
    useChangeTeamMutation()

  const { data: team } = useGetTeamByIdQuery(teamId, {
    skip: !user?.userId,
  })

  const [deleteTeam] = useDeleteTeamMutation()
  const router = useRouter()
  const handleChangeTeams = async () => {
    try {
      console.log(teamId)
      if (userId) {
        const response = await changeTeam({ userId, teamId })
      }
    } catch (error) {
      console.error("Error in handleChangeTeams:", error)
    }
  }
  React.useEffect(() => {
    console.log(user)
    console.log(teamId)
  }, [])

  const deleteTeamFunc = async () => {
    try {
      if(teamId && userId) {
        const response = await deleteTeam({teamId, userId})
        if (!response.error) {
          router.push("/searchTeams")
        }
      }
    } catch (error) {
      console.error("Error deleting team:", error)
    }
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {teamName}
          </Typography>
          <Typography variant="body1">
            {team?.projectManagerUserId === user?.userId
              ? "You manage this team"
              : `Managed by:${projectManager}`}
          </Typography>
          <Typography
            className="pt-4"
            variant="body1"
            sx={{ color: "text.primary" }}
          >
            Count of members: {userCount}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {teamId === userTeamId ? (
          <div className="w-full flex justify-between">
            <Button disabled size="medium" color="primary">
              Its your team
            </Button>

            {team?.projectManagerUserId === user?.userId ? (
              <div className="flex gap-2 ">
                <Trash
                  className="cursor-pointer"
                  size={20}
                  onClick={deleteTeamFunc}
                ></Trash>
                <Edit onClick={() => setOpenModal(true)} size={20} />{" "}
              </div>
            ) : null}
          </div>
        ) : (
          <Button
            onClick={handleChangeTeams}
            size="medium"
            color="primary"
            disabled={isSuccess}
          >
            {team?.projectManagerUserId === user?.userId
              ? "Change team"
              : "JOIN"}
          </Button>
        )}
      </CardActions>
      {openModal && (
        <ModalNewTeam
          onClose={() => setOpenModal(false)}
          isOpen={openModal}
          teamId={teamId}
          teamNameEdit={teamName}
          projectManagerUserIdEdit={team?.projectManagerUserId}
        />
      )}
    </Card>
  )
}
