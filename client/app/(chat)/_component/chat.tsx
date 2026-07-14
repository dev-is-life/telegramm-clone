import MessageCard from '@/components/cards/message-card'
import ChatLoading from '@/components/loadings/chat-loading'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { messageSchema } from '@/lib/validation'
import { Paperclip, Send, Smile } from 'lucide-react'
import React, { FC, useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import emojies from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTheme } from 'next-themes'
import { useLoading } from '@/hooks/use-loading'
import { IMessage } from '@/types'
import { useCurrentContact } from '@/hooks/use-current'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { UploadDropzone } from '@/lib/uploadthing'

interface Props {
	onSubmitMessage: (values: z.infer<typeof messageSchema>) => void
	onReaction: (reaction: string, messageId: string) => Promise<void>
	onDelete: (messageId: string) => Promise<void>
	onReadMessage: () => Promise<void>
	messageForm: UseFormReturn<z.infer<typeof messageSchema>>
	messages: IMessage[]
	onTyping: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Chat: FC<Props> = ({ onSubmitMessage, onReadMessage,  messageForm, messages, onReaction, onDelete, onTyping }) => {
	const { loadMessage, isCreating } = useLoading()
	const { editMessage, setEditMessage } = useCurrentContact()
	const scrollRef = useRef<HTMLFormElement | null>(null)
	const { resolvedTheme } = useTheme()
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [open, setOpen] = useState<boolean>(false)

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" })
		onReadMessage()
	},[messages])

	useEffect(() => {
		messageForm.setValue("text", editMessage?.text!)
		scrollRef.current?.scrollIntoView({ behavior: "smooth" })
	},[editMessage])

	const handleEmojiSelect = (emoji: string) => {
		const input = inputRef.current
		if (!input) return

		const text = messageForm.getValues('text')
		const start = input.selectionStart ?? 0
		const end = input.selectionEnd ?? 0

		const newText = text.slice(0, start) + emoji + text.slice(end)
		messageForm.setValue('text', newText)

		setTimeout(() => {
			input.setSelectionRange(start + emoji.length, start + emoji.length)
		}, 0)
	}

	return (
		<div className='flex flex-col justify-end z-40 min-h-[92vh]'>
			{loadMessage && <ChatLoading /> }

			{messages.map(message => (
				<MessageCard key={message._id} message={message} onReaction={onReaction} onDelete={onDelete} />
			))}

			{!loadMessage && messages.length === 0 && (
				<div className='w-full h-[88vh] flex items-center justify-center'>
					<div className='text-[100px] cursor-pointer' onClick={() => onSubmitMessage({ text: '✋' })}>
						✋
					</div>
				</div> 
			)}

			<Form {...messageForm}>
				<form onSubmit={messageForm.handleSubmit(onSubmitMessage)} className='w-full px-0.5 flex items-center relative' ref={scrollRef}>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button size={'icon'} type='button' variant={'secondary'}>
							<Paperclip />
						</Button>
					</DialogTrigger>
					<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
					</DialogHeader>
					<UploadDropzone endpoint={'imageUploader'} onClientUploadComplete={(res => {
						onSubmitMessage({ text: '', image: res[0].url })
						setOpen(false)
					})}
						config={{ appendOnPaste: true, mode: "auto" }}
					/>
					</DialogContent>
				</Dialog>
					<FormField
						control={messageForm.control}
						name='text'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormControl>
									<Input
										className='bg-secondary border-l h-9 rounded-none border-l-muted-foreground border-x-2 border-r-muted-foreground'
										placeholder='Type a message'
										value={field.value}
										onBlur={() => field.onBlur()}
										disabled={isCreating}
										onChange={e => {
											field.onChange(e.target.value)
											onTyping(e)
											if(e.target.value === "") setEditMessage(null)
										}}
										ref={inputRef}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<Popover>
						<PopoverTrigger asChild>
							<Button size='icon' type='button' variant='secondary'>
								<Smile />
							</Button>
						</PopoverTrigger>
						<PopoverContent className='p-0 border-none rounded-md absolute right-6 bottom-0'>
							<Picker
								data={emojies}
								theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
								onEmojiSelect={(emoji: { native: string }) => handleEmojiSelect(emoji.native)}
							/>
						</PopoverContent>
					</Popover>

					<Button type='submit' size={'icon'} disabled={isCreating} >
						<Send />
					</Button>
				</form>
			</Form>
		</div>
	)
}

export default Chat