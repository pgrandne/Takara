'use client'

import { useState } from 'react'
import { ConnectKitButton } from '../components/ConnectKitButton'
import { Connected } from '../components/Connected'
import { Tab } from '../components/Tab'
import { Account } from '../components/Account'
import { Game } from '../components/Game'
import { Header } from '../components/Header'

export default function Page() {
	const [gameActiveTab, setGameActiveTab] = useState(false)

	return (
		<>
			<Header />
			<Connected>
				<Tab
					gameActiveTab={gameActiveTab}
					setGameActiveTab={setGameActiveTab}
				/>
				{gameActiveTab ? <Game /> : <Account />}
			</Connected>
		</>
	)
}
