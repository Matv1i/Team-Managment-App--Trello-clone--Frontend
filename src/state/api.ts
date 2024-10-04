import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Search } from "lucide-react"

export interface Project {
  id: string
  name: string
  description?: string
  startDate?: string
  endDate?: string
  userId?: string
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export interface Task {
  id: string
  title: string
  description?: string
  status?: Status
  priority?: Priority
  tags?: string
  startDate?: string
  dueDate?: string
  points?: number
  projectId: string
  authorUserId?: string
  assignedUserId?: string

  author?: User
  assignee: User
  comments?: Comment[]
  attachments?: Attachment[]
}
export interface User {
  userId: string
  username: string
  email: string
  password: string

  profilePictureUrl?: string
  cognitoId?: string
  teamId?: number
}
export interface Attachment {
  id: string
  fileURL: string
  fileName: string
  taskId: string
  uploadedBy: string
}
export interface SearchResults {
  tasks?: Task[]
  projects?: Project[]
  users?: User[]
}

export interface Team {
  taskId: string
  teamName?: string
  productOwnerUserId?: number
  projectManagerUserId?: number
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: "include",
  }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "User", "Teams"],
  endpoints: (build) => ({
    getProjects: build.query<Project[], String>({
      query: (userId) => `projects/${userId}`,
      providesTags: ["Projects"],
    }),
    getProjectId: build.query<String, String>({
      query: (userId) => `projects/projectId/${userId}`,
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    getTasks: build.query<Task[], { projectId: string }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),
    getTaskByUser: build.query<Task[], string>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    createUser: build.mutation<User, Partial<User>>({
      query: (user) => ({
        url: "users/register",
        method: "POST",
        body: user,
      }),
    }),
    loginUser: build.mutation<User, Partial<User>>({
      query: (user) => ({
        url: "users/login",
        method: "POST",
        body: user,
      }),
    }),
    getCurrentUserInfo: build.query<User, void>({
      query: () => ({
        url: "/users/getUser",
      }),
    }),
    deleteCookies: build.mutation<VoidFunction, void>({
      query: () => ({
        url: "/users/cookies",
        method: "POST",
      }),
    }),

    updateTaskStatus: build.mutation<Task, { taskId: string; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
    getUsers: build.query<User[], void>({
      query: () => "users",

      providesTags: ["User"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",

      providesTags: ["Teams"],
    }),
  }),
})

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTaskByUserQuery,
  useCreateUserMutation,
  useLoginUserMutation,
  useGetCurrentUserInfoQuery,
  useDeleteCookiesMutation,
  useGetProjectIdQuery,
} = api
