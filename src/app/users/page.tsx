"use client"
import {
  useChangeTeamMutation,
  useGetCurrentUserInfoQuery,
  useGetTeamByIdQuery,
  useGetUsersByTeamIdQuery,
  useGetUsersQuery,
} from "@/state/api"
import React from "react"
import { useAppSelector } from "../redux"
import Header from "@/components/Header"
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid"
import Image from "next/image"
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils"
import { AudioWaveform, User2, UserCircle } from "lucide-react"

const CustomToolBar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
)

const Users = () => {
  const columns: GridColDef[] = [
    { field: "userId", headerName: "ID", width: 200 },
    { field: "username", headerName: "Username", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "profilePicture",
      headerName: "Profile Picture",
      width: 100,
      renderCell: (params) => (
        <div className="flex h-full items-center jusifyu-center">
          <div className="h-9 w-9">
            {params.row.profilePictureUrl ? (
              <img
                src={params.row.profilePictureUrl}
                alt={params.row.username}
                width={100}
                height={50}
                className="h-full rounded-full object-cover"
              />
            ) : (
              <UserCircle />
            )}
          </div>
        </div>
      ),
    },
    {
      field: "delete",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        return team?.projectManagerUserId === user?.userId ? (
          <button
            className="text-red-500"
            onClick={() => handeDeleteUser(params.row.userId)}
          >
            Delete
          </button>
        ) : null
      },
    },
  ]
  const { data: user } = useGetCurrentUserInfoQuery()
  console.log(user?.teamId)

  const {
    data: users,
    isLoading,
    isError,
  } = useGetUsersByTeamIdQuery(user?.teamId || "", {
    skip: !user?.teamId, // Skip the query until teamId is available
  })
  const { data: team } = useGetTeamByIdQuery(user?.teamId || "", {
    skip: !user?.teamId,
  })
  console.log(users)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const [changeTeam] = useChangeTeamMutation()

  if (isLoading) return <div>Loading...</div>
  if (isError || !users) return <div>Error fetching users</div>

  const handeDeleteUser = async (userId: string) => {
    if(team && user){
      if(team.projectManagerUserId === user.userId){
        return alert("You are manager. You cannot do it  ")
      }
    }


    if (userId) {
      const teamId = null
      const patchUser = await changeTeam({ userId, teamId })
      if (patchUser.data) {
        window.location.reload()
      }
    }
  }

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          getRowId={(row) => row.userId}
          pagination
          slots={{
            toolbar: CustomToolBar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
          rows={users || []}
          columns={columns}
        />
      </div>
    </div>
  )
}

export default Users
