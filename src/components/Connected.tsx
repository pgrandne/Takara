'use client'

import { useAccount } from 'wagmi'

export function Connected({ children }: { children: React.ReactNode }) {
	const { isConnected } = useAccount()

	if (!isConnected)
		return (
			<div className='flex mt-52 justify-center items-center text-5xl'>
				Please Connect
			</div>
		)
	return <>{children}</>
}
