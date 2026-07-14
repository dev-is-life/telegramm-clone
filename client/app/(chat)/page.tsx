"use client"

import { Loader2 } from "lucide-react"
import ContactList from "./_component/contact-list"
import { ChangeEvent, useEffect, useInsertionEffect, useRef, useState } from "react"
import { useCurrentContact } from "@/hooks/use-current"
import { useRouter, useSearchParams } from "next/navigation"
import AddContact from "./_component/add-contact"
import { useForm } from "react-hook-form"
import { emailSchema, messageSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import TopChat from "./_component/top-chat"
import Chat from "./_component/chat"
import { useLoading } from "@/hooks/use-loading"
import { axiosClient } from "@/http/axios"
import { generateToken } from "@/lib/generate.token"
import { useSession } from "next-auth/react"
import { IError, IMessage, IUser } from "@/types"
import { toast } from "react-toastify"
import { io } from "socket.io-client"
import { useAuth } from "@/hooks/use-auth"
import useAudio from "@/hooks/use-audio"
import { CONST } from "@/lib/constants"

const HomePage = () => {
  const [contacts, setContacts] = useState<IUser[]>([])
  const [messages, setMessages] = useState<IMessage[]>([])
  const { currentContact, editMessage, setEditMessage } = useCurrentContact()
  const { setIsCreating, setIsLoading, isLoading, setLoadMessage, setTyping } = useLoading()
  const { data: session } = useSession()
  const { setOnlineUsers } = useAuth()
  const { playSound } = useAudio()

  const searchParams = useSearchParams()
  const router = useRouter()
  const socket = useRef<ReturnType<typeof io> | null>(null)

  const CONTACT_ID = searchParams.get("chat") 

  const contactForm = useForm<z.infer<typeof emailSchema>>({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: '' },
	})

  const getContacts = async () => {
    setIsLoading(true)
    const token = await generateToken(session?.currentUser._id)
    try {
      const { data } = await axiosClient.get<{ contacts: IUser[]}>(`/api/user/contacts`, { headers: { Authorization: `Bearer ${token}`}})
      setContacts(data.contacts)
    } catch (error: any) {
      if ((error as IError)?.response?.data?.message){
        toast.error((error as IError).response.data.message)
      }
    }finally{
      setIsLoading(false)
    }
  }
  
  const getMessages = async () => {
    setLoadMessage(true)
    const token = await generateToken(session?.currentUser._id)
    try {
      const { data } = await axiosClient.get<{ messages: IMessage[] }>(`/api/user/messages/${currentContact?._id}`, { headers: { Authorization: `Bearer ${token}`}})
      setMessages(data.messages)
      setContacts(prev => prev.map(item => item._id === currentContact?._id ? {...item, lastMessage: item.lastMessage ? { ...item.lastMessage, status: CONST.READ } : null} : item))
    } catch {
      toast.error("Cannot get messages")
    }finally{
      setLoadMessage(false)
    }
  }

  const messageForm = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: { text: '', image: '' },
	})

  const onCreateContact = async(values: z.infer<typeof emailSchema>) => {
    setIsCreating(true)
    const token = await generateToken(session?.currentUser._id)
    try {
      const { data } = await axiosClient.post<{ contact: IUser}>(`/api/user/contact`, values, { headers: { Authorization: `Bearer ${token}`}})
      setContacts(prev => [...prev, data.contact])
      socket.current?.emit('createContact', { currentUser: session?.currentUser, receiver: data.contact })
      contactForm.reset()
      toast("Contact edit succesfully!")
    } catch (error: any) {
      if ((error as IError)?.response?.data?.message){
        toast.error((error as IError).response.data.message)
      }
    }finally{
      setIsCreating(false)
    }
	}

  const onSubmitMessage = async(values: z.infer<typeof messageSchema>) => {
    setIsCreating(true)
    if(editMessage?._id){
      onEdit(editMessage._id, values.text)
    }else {
      onSendMessage(values)
    }
  }

  const onSendMessage = async(values: z.infer<typeof messageSchema>) => {
		setIsCreating(true)
    const token = await generateToken(session?.currentUser._id)
    try {
      const { data } = await axiosClient.post<GetSocketType>('/api/user/message', {...values, receiver: currentContact?._id}, { headers: { Authorization: `Bearer ${token}`}})
      setMessages(prev => [...prev, data.newMessage ])
      setContacts(prev => prev.map(item => item._id === currentContact?._id ? {...item, lastMessage: {...data.newMessage, status: CONST.READ } } : item))
      messageForm.reset()
      socket.current?.emit('sendMessage', { newMessage: data.newMessage, receiver: data.receiver, sender: data.sender })
      if(!data.sender.muted){
        playSound(data.sender.sendingSound)
      }
    } catch (error) {
      toast.error("Cannnot send message")
    } finally {
      setIsCreating(false)
    }
	}

  const OnReadMessages = async() => {
    const receivedMessages = messages.filter(message => message.receiver._id === session?.currentUser._id).filter(message => message.status !== CONST.READ)
    if(receivedMessages.length === 0) return
    const token = await generateToken(session?.currentUser._id)

    try {
      const { data } = await axiosClient.post<{ messages: IMessage[] }>(`/api/user/message-read`, { messages: receivedMessages }, { headers: { Authorization: `Bearer ${token}`}})
      socket.current?.emit('readMessage', { receiver: currentContact, messages: data.messages })
      
      setMessages(prev => {
        return prev.map(item => {
          const message = data.messages.find(msg => msg._id === item._id)
          return message ? {...item, status: CONST.READ } : item 
        })
      })
    } catch {
      toast("Cannot read message!")
    }
  }

  const onReaction = async(reaction: string, messageId: string) => {
    const token = await generateToken(session?.currentUser._id)
    try {
      const { data } = await axiosClient.post<{ updatedMessage: IMessage }>('/api/user/reaction', { messageId, reaction }, { headers: { Authorization: `Bearer ${token}`}})
      setMessages(prev => prev.map(item => (item._id === data.updatedMessage._id ? {...item, reaction: data.updatedMessage.reaction } : item)))
      socket.current?.emit('updateMessage', {
        updateMessage: data.updatedMessage,
        sender: session?.currentUser,
        receiver: currentContact
      })
    } catch (error) {
      toast("Cannot reaction to message")
    }
  }

  const onDelete = async (messageId: string) => {
    const token = await generateToken(session?.currentUser._id)

    try {
      const { data } = await axiosClient.delete<{ deletedMessage: IMessage }>(`/api/user/message/${messageId}`, { headers: { Authorization: `Bearer ${token}`}})
      const filteredMessage = messages.filter(item => item._id !== data.deletedMessage._id)
      setMessages(filteredMessage)
      socket.current?.emit("deleteMessage", { 
        deleteMessage: data.deletedMessage, 
        sender: session?.currentUser, 
        receiver: currentContact,
        filteredMessage,
      })
      setContacts(prev => prev.map(contact => contact._id === currentContact?._id ? {...contact, lastMessage: filteredMessage.length ? contact.lastMessage?._id === messageId ? filteredMessage[filteredMessage.length - 1] : null : contact.lastMessage } : contact))
    } catch (error) {
      toast("Cannot delete message")
    }
  }

  const onEdit = async (messageId: string, text: string) => {
    const token = await generateToken(session?.currentUser._id)

    try {
      const { data } = await axiosClient.put<{ updatedMessage: IMessage }>(`/api/user/message/${messageId}`, { text }, { headers: { Authorization: `Bearer ${token}`}})
      setMessages(prev => prev.map(message => message._id === data.updatedMessage._id ? {...message, text: data.updatedMessage.text } : message))
      socket.current?.emit('updateMessage', {
        updateMessage: data.updatedMessage,
        sender: session?.currentUser,
        receiver: currentContact
      })
      messageForm.reset()
      setContacts(prev => prev.map(contact => contact._id === currentContact?._id ? { ...contact, lastMessage: contact.lastMessage?._id === messageId ? data.updatedMessage : contact.lastMessage } : contact))
      setEditMessage(null)
    } catch (error) {
      toast("Cannot updated message")
    }
  }

  const onTyping = async (event: ChangeEvent<HTMLInputElement>) => {
    socket.current?.emit("typing", { receiver: currentContact, sender: session?.currentUser, message: event.target.value })
  }

  useEffect(() => {
    router.replace("/")
    socket.current = io('ws://telegramm-clone.vercel.app')
  },[])

  useEffect(() => {
    if(session?.currentUser._id){
      socket.current?.emit("addOnlineUser", session.currentUser)
      socket.current?.on('getOnlineUsers', (data: { socketId: string, user: IUser }[]) => {
        setOnlineUsers(data.map(item => item.user))
      })
      getContacts()
    }
  },[session?.currentUser])

  useEffect(() => {
    if(session?.currentUser){
      socket.current?.on("getCreateUser", user => {
       setContacts(prev => {
        const isExist = prev.some(item => item._id === user._id)
        return isExist ? prev : [prev, user]
       })
      })

      socket.current?.on("getNewMessage", ({ newMessage, sender, receiver }: GetSocketType) => {
        setTyping('')
        if (CONTACT_ID === sender._id) {
					setMessages(prev => [...prev, newMessage])
				}
        setContacts(prev => prev.map(item => item._id === sender._id ? { ...item, lastMessage: {...newMessage, status: CONTACT_ID === sender._id ? CONST.READ : newMessage.status }} : item))
        if(!receiver.muted){
          playSound(receiver.notificationSound)
        }
      })

      socket.current?.on('getReadMessage', (messages: IMessage[]) => {
        setMessages(prev => {
          return prev.map(item => {
            const message = messages.find(msg => msg._id === item._id)
            return message ? {...item, status: CONST.READ } : item
          })
        })
      })

      socket.current?.on("getUpdateMessage", ({ newMessage, sender }: GetSocketType) => {
        setTyping("")
        setMessages(prev => prev.map(item => (item._id === newMessage._id ? {...item, reaction: newMessage.reaction, text: newMessage.text } : item)))
        setContacts(prev => prev.map(contact => contact._id === sender._id ? {...contact, lastMessage: contact.lastMessage?._id === newMessage._id ? newMessage : contact.lastMessage } : contact))
      })

      socket.current?.on("getDeleteMessage", ({ newMessage, sender, filteredMessage }: GetSocketType) => {
        setMessages(prev => prev.filter(item => item._id !== newMessage._id))
				const lastMessage = filteredMessage.length ? filteredMessage[filteredMessage.length - 1] : null
				setContacts(prev =>
					prev.map(item =>
						item._id === sender._id
							? { ...item, lastMessage: item.lastMessage?._id === newMessage._id ? lastMessage : item.lastMessage }
							: item
					)
				)
      })

      socket.current?.on("getTyping", ({ message, sender }: GetSocketType) => {
        if(CONTACT_ID === sender._id){
          setTyping(message)
        }
      })
    }
  },[session?.currentUser, socket, CONTACT_ID])

  useEffect(() => {
    if(currentContact){
      getMessages()
    }
  },[currentContact])

  return (
    <div>
        <div className="h-screen w-80 max-md:w-12 border-r fixed inset-0 z-50">
            {isLoading && (
              <div className="w-full h-[95vh] flex justify-center md:items-center items-start max-md:py-8">
                <div className="max-md:hidden">
                  <Loader2 className="animate-spin" size={50}/>
                </div>

                <div className="md:hidden">
                  <Loader2 className="animate-spin" size={12}/>
                </div>
              </div> 
            )}

            {!isLoading && <ContactList contacts={contacts}/>}
        </div>
        <div className="pl-80 max-md:pl-12">
          {!currentContact?._id && <AddContact contactForm={contactForm} onCreateContact={onCreateContact} />}
          {currentContact?._id && <div className="w-full relative">
            <TopChat messages={messages} />
            <Chat 
              messageForm={messageForm} 
              onSubmitMessage={onSubmitMessage} 
              onReadMessage={OnReadMessages} 
              messages={messages} 
              onReaction={onReaction}
              onDelete={onDelete}
              onTyping={onTyping}
            />
            </div>}
        </div>

    </div>
  )
}

export default HomePage

interface GetSocketType {
  receiver: IUser
  sender: IUser
  newMessage: IMessage
  filteredMessage: IMessage[]
  message: string
}
