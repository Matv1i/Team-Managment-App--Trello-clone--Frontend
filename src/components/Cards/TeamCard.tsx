"use client"
import * as React from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import CardActionArea from "@mui/material/CardActionArea"
import CardActions from "@mui/material/CardActions"
import { useChangeTeamMutation, useGetCurrentUserInfoQuery } from "@/state/api"
import { useAppSelector } from "@/app/redux"
import { useDispatch } from "react-redux"

import { useRouter } from "next/navigation"

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
  const { data: user } = useGetCurrentUserInfoQuery() // Получаем данные о пользователе и функцию refetch
  const dispatch = useDispatch()
  const [changeTeam, { isError, isSuccess, isLoading }] =
    useChangeTeamMutation()
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

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {teamName}
          </Typography>
          <Typography variant="body1">Managed by: {projectManager}</Typography>
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
          <Button disabled size="medium" color="primary">
            It's your team
          </Button>
        ) : (
          <Button
            onClick={handleChangeTeams}
            size="medium"
            color="primary"
            disabled={isSuccess}
          >
            {isSuccess ? "It's your team" : "Join"}
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
