"use client"
import { useGetTeamsQuery } from "@/state/api"
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
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team Name", width: 200 },
  { field: "productOwnerUsername", headerName: "Product Owner", width: 200 },
  {
    field: "projectManagerUsername",
    headerName: "Product manager",
    width: 200,
  },
]

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  if (isLoading) return <div>Loading...</div>
  if (isError || !teams) return <div>Error fetching teams</div>

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Teams" />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          getRowId={(row) => row.userId}
          pagination
          slots={{
            toolbar: CustomToolBar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
          rows={teams || []}
          columns={columns}
        />
      </div>
    </div>
  )
}

export default Teams
