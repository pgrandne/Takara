'use client'

import { Dispatch, SetStateAction } from 'react'

export const Tab = ({
	gameActiveTab,
	setGameActiveTab,
}: {
	gameActiveTab: boolean
	setGameActiveTab: Dispatch<SetStateAction<boolean>>
}) => {
	return (
		<>
			<div className='w-1/2 mx-auto mt-3 mb-3 rounded'>
				<ul id='tabs' className='inline-flex justify-center w-full px-1 pt-2'>
					<li
						className={`px-4 py-2 -mb-px font-semibold text-gray-800  cursor-pointer ${
							!gameActiveTab
								? 'border-b-2 border-indigo-500 rounded-t opacity-80'
								: 'opacity-50'
						} `}
						onClick={() => setGameActiveTab(false)}
					>
						Account
					</li>
					<li
						className={`px-4 py-2 -mb-px font-semibold text-gray-800  cursor-pointer ${
							gameActiveTab
								? 'border-b-2 border-indigo-500 rounded-t opacity-80'
								: 'opacity-50'
						} `}
						onClick={() => setGameActiveTab(true)}
					>
						Game
					</li>
				</ul>
			</div>
		</>
	)
}
