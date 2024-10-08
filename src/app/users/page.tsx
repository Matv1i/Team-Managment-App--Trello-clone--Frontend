"use client"
import {
  useGetCurrentUserInfoQuery,
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

const CustomToolBar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
)

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 100 },
  { field: "username", headerName: "Username", width: 150 },
  {
    field: "profilePicture",
    headerName: "Profile Picture",
    width: 100,
    renderCell: (params) => (
      <div className="flex h-full items-center jusifyu-center">
        <div className="h-9 w-9">
          <Image
            src={`https://pm-s3-bucket-12er3te.s3.eu-north-1.amazonaws.com/${params.value}`}
            alt={params.row.username}
            width={100}
            height={50}
            className="h-full rounded-full object-cover"
          />
        </div>
      </div>
    ),
  },
]

const Users = () => {
  const { data: user } = useGetCurrentUserInfoQuery()
  console.log(user?.teamId)
  const {
    data: users,
    isLoading,
    isError,
  } = useGetUsersByTeamIdQuery(user?.teamId || "", {
    skip: !user?.teamId, // Skip the query until teamId is available
  })
  console.log(users)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  if (isLoading) return <div>Loading...</div>
  if (isError || !users) return <div>Error fetching users</div>

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
