import { useCurrentContact } from '@/hooks/use-current'
import { CONST } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { IMessage } from '@/types'
import { format } from 'date-fns'
import { Check, CheckCheck, Edit2, Trash2 } from 'lucide-react'
import { FC } from 'react'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '../ui/context-menu'
import Image from 'next/image'

interface Props {
	message: IMessage
	onReaction: (reaction: string, messageId: string) => Promise<void>
	onDelete: (messageId: string) => Promise<void>
}

const reactions = ['👍', '😂', '❤️', '😍', '👎']


const MessageCard: FC<Props> = ({ message, onReaction, onDelete }) => {
	const { currentContact, setEditMessage } = useCurrentContact()
	const isReceived = message.receiver._id === currentContact?._id



	return (
		<ContextMenu>
			<ContextMenuTrigger>
			<div
				className={cn(
					'm-1.5 font-medium text-xs flex',
					isReceived ? 'justify-start' : 'justify-end'
				)}
			>
				<div
					className={cn(
						'relative inline p-2 pl-2.5 pr-12 max-w-[80%] rounded-xl shadow-sm transition-colors',
						isReceived
							? 
							'bg-sky-500 text-white dark:bg-sky-500'
							: 
							'bg-gray-200 text-gray-900 dark:bg-white/20 dark:text-white'
					)}
				>	
					{message.image && (
						<Image
							src={message.image}
							alt={message.image}
							width={200}
							height={150}
						/>
					)}
					{message.text.length > 0 && <p className='text-sm break-words'>{message.text}</p>}
					<span className='text-[10px] right-0 bottom-0 absolute opacity-60'>
						<div className='right-1 bottom-0 absolute opacity-80 text-[9px] flex gap-[3px]'>
							<p>{format(message.updatedAt, "hh:mm")}</p>
							<div className='self-end'>{message.receiver._id === currentContact?._id && (
								message.status === CONST.READ ? <CheckCheck size={12} /> : <Check size={12} />
							)}</div>
						</div>
					</span>
					<span className='absolute -right-2 -bottom-2'>{message.reaction}</span>
				</div>
			</div>
			</ContextMenuTrigger>
			<ContextMenuContent className='w-56 p-2 mb-2 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 backdrop-blur-sm transition-all duration-150'>
				<ContextMenuItem className='grid grid-cols-5 gap-1 p-1'>
					{reactions.map(reaction => (
					<div
						key={reaction}
						className={cn(
						'flex items-center justify-center text-xl cursor-pointer p-2 rounded-xl transition-all',
						'hover:bg-sky-100 dark:hover:bg-sky-700',
						message.reaction === reaction && 'bg-sky-400 text-white'
						)}
						onClick={() => onReaction(reaction, message._id)}
					>
						{reaction}
					</div>
					))}
				</ContextMenuItem>

				{message.sender._id !== currentContact?._id && (
					<>
					<ContextMenuSeparator className='my-1 border-t border-gray-200 dark:border-gray-700' />

					{!message.image && (
						<ContextMenuItem className='flex items-center gap-2 p-2 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all' onClick={() => setEditMessage(message)}>
							<Edit2 size={14} className='text-gray-600 dark:text-gray-300' />
							<span className='text-sm text-gray-700 dark:text-gray-200'>Edit</span>
						</ContextMenuItem>
					)}

					<ContextMenuItem
						className='flex items-center gap-2 p-2 rounded-xl cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-all'
						onClick={() => onDelete(message._id)}
					>
						<Trash2 size={14} className='text-red-600 dark:text-red-400' />
						<span className='text-sm text-red-600 dark:text-red-400'>Delete</span>
					</ContextMenuItem>
					</>
				)}
				</ContextMenuContent>

		</ContextMenu>
	)
}

export default MessageCard
