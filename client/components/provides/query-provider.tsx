"use client"

import { ChildProps, IError } from "@/types"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FC } from "react"
import { toast } from "react-toastify"

const handleQueryError = (error: Error | IError) => {
  if ((error as IError)?.response?.data?.message){
    toast.error((error as IError).response.data.message)
  }

  toast.error("Something went wrong!")
}

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { onError: handleQueryError }
  }
})

const QueryProvider: FC<ChildProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default QueryProvider