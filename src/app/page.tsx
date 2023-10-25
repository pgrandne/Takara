'use client'

import { useEffect, useState } from 'react'
import { Connected } from '../components/Connected'
import { Tab } from '../components/Tab'
import { Account } from '../components/Account'
import { Game } from '../components/Game'
import { Header } from '../components/Header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
			<ToastContainer position='bottom-right' />
		</>
	)
}
