'use client'

import { ConnectKitButton } from 'connectkit'
import Image from 'next/image'
import Radish from '../app/images/radish.png'
import { Titillium_Web } from 'next/font/google'
const titillium_Web = Titillium_Web({
	weight: ['200', '300', '400', '600', '700'],
	subsets: ['latin'],
})
import { useAccount, useContractRead } from 'wagmi'
import { takaraABI } from '../utils/takaraABI'
import { sdaiContract, takaraContract } from '../utils/contracts'
import { useState } from 'react'
import { erc4626ABI } from 'wagmi'

export function Header() {
	const { address } = useAccount()
	const [nbPlayers, setNbPlayers] = useState(0)
	const [pool, setPool] = useState(0)

	const { refetch: refetchNbPlayers } = useContractRead({
		address: takaraContract,
		abi: takaraABI,
		functionName: 'getNbParticipants',
		watch: true,
		onSuccess(data: boolean) {
			setNbPlayers(Number(data))
		},
	})

	const { refetch: refetchMaxWithdraw } = useContractRead({
		address: sdaiContract,
		abi: erc4626ABI,
		functionName: 'maxWithdraw',
		args: [takaraContract],
		watch: true,
		onSuccess(data) {
			setPool(Number(data) / 10 ** 18)
		},
	})

	return (
		<>
			<div className='absolute left-2 top-2'>
				<Image
					src={Radish}
					width={70}
					height={70}
					alt='Picture of the author'
				></Image>
			</div>

			<h1
				className={`text-4xl mt-8 text-center uppercase ${titillium_Web.className}`}
			>
				Takara
			</h1>
			<div className='absolute right-2 top-2'>
				<ConnectKitButton />
			</div>
			<h2
				className={`text-center pt-5 text-2xl text-pink-700 ${titillium_Web.className}`}
			>
				Make your choice! Find Takara the radish and earn{' '}
				<span className='font-semibold'>
					{pool - nbPlayers * 100 + 0.1} DAI
				</span>
			</h2>
			<h3
				className={`text-center py-3 text-xl text-pink-600 ${titillium_Web.className}`}
			>
				Curently, {nbPlayers} {nbPlayers > 1 ? 'players are' : 'player is'}{' '}
				competing, next game in 7 hours
			</h3>
		</>
	)
}
