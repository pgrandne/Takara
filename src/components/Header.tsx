'use client'

import { ConnectKitButton } from 'connectkit'
import Image from 'next/image'
import Radish from '../app/images/radish.png'
import { Titillium_Web } from 'next/font/google'
const titillium_Web = Titillium_Web({
	weight: ['200', '300', '400', '600', '700'],
	subsets: ['latin'],
})

export function Header() {
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
				<span className='font-semibold'>7.32 DAI</span>
			</h2>
			<h3
				className={`text-center py-3 text-xl text-pink-600 ${titillium_Web.className}`}
			>
				Curently, 3 players are competing, next game in 10 hours
			</h3>
		</>
	)
}
