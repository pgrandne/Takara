'use client'

import {
	useAccount,
	useBalance,
	useContractRead,
	useContractWrite,
	usePrepareContractWrite,
	useWaitForTransaction,
} from 'wagmi'
import Image from 'next/image'
import wallet from '../app/images/wallet.png'
import { useState } from 'react'
import { takaraABI } from '../utils/takaraABI'
import { daiContract, sdaiContract, takaraContract } from '../utils/contracts'
import { erc20ABI } from 'wagmi'

export function Account() {
	const [balance, setBalance] = useState(0)
	const [allowance, setAllowance] = useState(0)
	const [isPlayer, setIsPlayer] = useState(false)
	const { address } = useAccount()

	// DAI Balance
	const { data: dataBalance, refetch: refetchBalance } = useBalance({
		address,
		token: daiContract,
		watch: true,
		onSuccess(data) {
			setBalance(parseFloat(data.formatted))
		},
	})

	// Allowance

	const { data: dataAllowance, refetch: refetchAllowance } = useContractRead({
		address: daiContract,
		abi: erc20ABI,
		functionName: 'allowance',
		args: [address!, takaraContract],
		watch: true,
		onSuccess(data) {
			setAllowance(Number(data) / 10 ** 18)
		},
	})

	// Ticket

	const { data: dataPlayer, refetch: refetchPlayer } = useContractRead({
		address: takaraContract,
		abi: takaraABI,
		functionName: 'isPlayer',
		args: [address!],
		watch: true,
		onSuccess(data: boolean) {
			setIsPlayer(data)
		},
	})

	// DAI Approve function

	const { config: configApprove, error: errorApprove } =
		usePrepareContractWrite({
			address: daiContract,
			abi: erc20ABI,
			functionName: 'approve',
			args: [takaraContract, BigInt(100 * 10 ** 18)],
		})
	const { write: approve, data: dataApprove } = useContractWrite(configApprove)

	const {
		data: receiptApprove,
		isLoading: isPendingApprove,
		isSuccess: isSuccessApprove,
	} = useWaitForTransaction({
		hash: dataApprove?.hash,
		onSuccess(data) {
			buyTicket?.()
		},
	})

	// Takara Deposit function

	const { config: configBuyTicket, error: errorTakara } =
		usePrepareContractWrite({
			address: takaraContract,
			abi: takaraABI,
			functionName: 'buyTicket',
		})
	const { write: buyTicket, data: dataBuyTicket } = useContractWrite({
		...configBuyTicket,
		onSuccess(data) {},
	})

	const {
		data: receipt,
		isLoading: isPending,
		isSuccess,
	} = useWaitForTransaction({ hash: dataBuyTicket?.hash })

	return (
		<div className='mt-10 max-w-2xl mx-auto flex justify-center'>
			<div className='bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700'>
				{!isPlayer && (
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
								onClick={() => (allowance >= 100 ? buyTicket?.() : approve?.())}
							>
								Buy 🎟️
							</button>
						) : (
							<div>You need 100 DAI minimum to buy a ticket</div>
						)}
					</div>
				)}

				{isPlayer && (
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
							// onClick={() => buyTicket?.()}
						>
							Withdraw 🪙
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
