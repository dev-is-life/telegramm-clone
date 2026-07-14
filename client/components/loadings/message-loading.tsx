import { cn } from '@/lib/utils'
import { FC } from 'react'
import { Skeleton } from '../ui/skeleton'

interface Props {
	isReceived?: boolean
}
const MessageLoading: FC<Props> = ({ isReceived }) => {
	return (
		<div
			className={cn(
				'm-2.5 font-medium text-xs flex',
				isReceived ? 'justify-start' : 'justify-end'
			)}
		>
			<Skeleton
				className={cn(
					'relative inline p-2 pl-2.5 pr-12 rounded-xl max-w-[80%]',
					isReceived
						? 'bg-sky-500/60 dark:bg-sky-500/50'
						: 'bg-gray-300 dark:bg-gray-600'
				)}
			>
				<Skeleton className='w-36 h-5' />
				<span className='text-[10px] right-2 bottom-1 absolute opacity-60'>✓</span>
			</Skeleton>
		</div>
	)
}

export default MessageLoading
