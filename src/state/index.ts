import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface initialStateTypes {
  isSidebarCollapsed: boolean
  isDarkMode: boolean
  userId: string

  isLogged: boolean
}

const initialState: initialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  userId: "",

  isLogged: false,
}

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload
    },

    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload
    },

    setIsLogged: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
  },
})

export const {
  setIsDarkMode,

  setIsSidebarCollapsed,
  setUserId,
  setIsLogged,
} = globalSlice.actions

export default globalSlice.reducer
