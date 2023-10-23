'use client'

import {
	useAccount,
	useBalance,
	usePrepareContractWrite,
	useContractWrite,
	useWaitForTransaction,
} from 'wagmi'
import Image from 'next/image'
import wallet from '../app/images/wallet.png'
import { useState } from 'react'
import { takaraABI } from '../utils/takaraABI'

export function Account() {
	const [balance, setBalance] = useState(0)
	const { address } = useAccount()
	const { data, refetch } = useBalance({
		address,
		token: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
		watch: true,
		onSuccess(data) {
			setBalance(parseFloat(data.formatted))
		},
	})

	// 0xd5082a9815057f717f15633a41710783017ee97d

	const { config, error } = usePrepareContractWrite({
		address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
		abi: takaraABI,
		functionName: 'deposit',
		args: [100],
	})
	const { write, data: dataDone } = useContractWrite(config)

	const {
		data: receipt,
		isLoading: isPending,
		isSuccess,
	} = useWaitForTransaction({ hash: dataDone?.hash })

	return (
		<div className='mt-10 max-w-2xl mx-auto flex justify-center'>
			<div className='bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700'>
				{address !== '0x823dcdE7d906CF8bF1BB4208238eBB015Fe5bd0a' && (
					<div className='space-y-6'>
						<h3 className='text-xl font-medium text-gray-900 dark:text-white'>
							Your Account
						</h3>
						<div>You don&apos;t have a ticket</div>
						<div>
							<label className='text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300'>
								The price of a ticket is 100 DAI
							</label>
							<label className='text-sm font-medium text-gray-900 flex mb-2 dark:text-gray-300'>
								You have {balance.toFixed(2)} DAI in your
								<Image
									className='ml-2'
									src={wallet}
									width={20}
									height={20}
									alt='Picture of the author'
								/>
							</label>
						</div>
						{balance >= 100 ? (
							<button
								className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
								onClick={() => write?.()}
							>
								Buy 🎟️
							</button>
						) : (
							<div>You need 100 DAI minimum to buy a ticket</div>
						)}
					</div>
				)}

				{address === '0x823dcdE7d906CF8bF1BB4208238eBB015Fe5bd0a' && (
					<div className='space-y-6'>
						<h3 className='text-xl font-medium text-gray-900 dark:text-white'>
							Your Account
						</h3>
						<div>You have a ticket 🎟️</div>
						<div>
							<label className='text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300'>
								You can return your ticket
							</label>
							<label className='text-sm font-medium text-gray-900 flex mb-2 dark:text-gray-300'>
								and get your 100 DAI back
							</label>
						</div>
						<button
							className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
							onClick={() => write?.()}
						>
							Withdraw 🪙
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
