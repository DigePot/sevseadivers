import type { AxiosRequestConfig } from "axios"

import axios from "axios"

import { CONFIG } from "../global-config"

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl })

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong!"
    )
)

export default axiosInstance

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args]

    const res = await axiosInstance.get(url, { ...config })

    return res.data
  } catch (error) {
    console.error("Failed to fetch:", error)
    throw error
  }
}

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    signIn: "/api/auth/sign-in",
    signUp: "/api/auth/sign-up",
  },
  course: {
    create: "/api/courses/add",
    getAll: "/api/courses/all",
    getById: (id: string) => `/api/courses/${id}`,
    update: (id: string) => `/api/courses/${id}`,
    delete: (id: string) => `/api/courses/${id}`,
  },
}
