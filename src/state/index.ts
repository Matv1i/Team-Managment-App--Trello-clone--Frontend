import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useGetCurrentUserInfoMutation } from "./api" // Assuming this is an API slice

// Define the shape of the initial state
export interface initialStateTypes {
  isSidebarCollapsed: boolean
  isDarkMode: boolean
  username: string
  userId: string
  isLogged: boolean
  loading: boolean
  error: string | null
}

const initialState: initialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  username: "",
  userId: "",

  isLogged: false,
  loading: false, // Add loading state
  error: null, // Add error state
}

// Async thunk to fetch user information
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      // Call the API using the mutation
      const [getCurrentUserInfo] = useGetCurrentUserInfoMutation()
      const response = await getCurrentUserInfo().unwrap()
      return response // Return the user information on success
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user info")
    }
  }
)

// Create the global slice with reducers and async handling
export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    // Reducer to toggle the sidebar
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload
    },
    // Reducer to toggle dark mode
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload
    },
    // Reducer to set user email
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    // Reducer to set login status
    setIsLogged: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload
    },
  },
  extraReducers: (builder) => {
    // Handle pending state for fetchUserInfo
    builder.addCase(fetchUserInfo.pending, (state) => {
      state.loading = true
      state.error = null // Clear any previous errors
    })
    // Handle fulfilled state for fetchUserInfo
    builder.addCase(
      fetchUserInfo.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false
        state.username = action.payload.user.username // Assuming response has an 'email' field
        state.userId = action.payload.user.userId // Assuming response has an 'email' field
        state.isLogged = true // Set the user as logged in
      }
    )
    // Handle rejected state for fetchUserInfo
    builder.addCase(
      fetchUserInfo.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload // Capture the error message
        state.isLogged = false // Ensure the user is not logged in
      }
    )
  },
})

// Export actions from the slice for use in components
export const {
  setIsDarkMode,
  setIsSidebarCollapsed,
  setUsername,
  setUserId,
  setIsLogged,
} = globalSlice.actions

// Export the reducer to be used in the store
export default globalSlice.reducer
