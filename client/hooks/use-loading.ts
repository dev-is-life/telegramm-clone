import { create } from 'zustand'

type Store = {
	isCreating: boolean
    setIsCreating: (isCreating: boolean) => void 
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
    loadMessage: boolean
    setLoadMessage: (loadMessage: boolean) => void
    typing: string
    setTyping: (typing: string) => void
}

export const useLoading = create<Store>()(set => ({
    isCreating: false,
    setIsCreating: isCreating => set({ isCreating }),
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
    loadMessage: false,
    setLoadMessage(loadMessage) {
        set({ loadMessage })
    },
    typing: "",
    setTyping(typing) { set({ typing })},
}))
