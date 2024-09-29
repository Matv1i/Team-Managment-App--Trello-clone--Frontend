export const dataGridClassNames =
  "border border-gray shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200 dark:text-white"

export const dataGridSxStyles = (isDarkMode: boolean) => {
  return {
    "& .MuiDataGrid-columnHeaders": {
      color: isDarkMode ? "#e5e7eb" : "",
    },
    "& [role='row'] > *": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
      borderColor: isDarkMode ? "#2d3135" : "",
    },
    "& .MuiIconbutton-root": {
      color: isDarkMode ? "#a3aa3" : null,
    },
    "& .MuiTablePagination-root": {
      color: isDarkMode ? "#a3aa3" : null,
    },
    "& .MuiTablePagination-selectIcon": {
      color: isDarkMode ? "#a3aa3" : null,
    },
    "& .MuiDataGrid-cell": {
      border: null,
    },
    "& .MuiDataGrid-row": {
      borderBottom: `1px solid ${isDarkMode ? "#2d2135" : "#e5e7eb"} `,
    },
    "& .MuiDataGrid-withBorderColor": {
      borderColor: isDarkMode ? "#2d2135" : "#e5e7eb",
    },
  }
}
