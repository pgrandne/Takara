import { useRef, useState, useEffect, useCallback } from 'react'
import { useAccount, useContractRead, useWaitForTransaction } from 'wagmi'
import { toast } from 'react-toastify'
import { takaraABI } from '../utils/takaraABI'
import { takaraContract } from '../utils/contracts'
import { writeContract, waitForTransaction } from '@wagmi/core'
import ReactCanvasConfetti from 'react-canvas-confetti'

interface ConfettiProps {
	refConfetti: (instance: any) => void
	style: React.CSSProperties
}

interface IPlayer {
	ticket: boolean
	lastDayPlayed: number
	lastPlot: number
	winner: boolean
}

const write = async (i: number) => {
	const notify1 = () =>
		toast('🦄 You transasaction is sent, please wait the result!')

	const { hash } = await writeContract({
		address: takaraContract,
		abi: takaraABI,
		functionName: 'play',
		args: [i],
	})
	notify1()
	const data = await waitForTransaction({
		hash: hash,
	})
	const notify2 = () => toast('Discovered plot!')
	notify2()
}

export const Game = () => {
	const refAnimationInstance = useRef<any | null>(null)

	const getInstance = useCallback((instance: any) => {
		refAnimationInstance.current = instance
	}, [])

	const makeShot = useCallback(
		(particleRatio: number, opts: any) => {
			refAnimationInstance.current &&
				refAnimationInstance.current({
					...opts,
					origin: { y: 0.7 },
					particleCount: Math.floor(200 * particleRatio),
				})
		},
		[refAnimationInstance]
	)

	const fire = useCallback(() => {
		makeShot(0.25, {
			spread: 26,
			startVelocity: 55,
		})

		makeShot(0.2, {
			spread: 60,
		})

		makeShot(0.35, {
			spread: 100,
			decay: 0.91,
			scalar: 0.8,
		})

		makeShot(0.1, {
			spread: 120,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2,
		})

		makeShot(0.1, {
			spread: 120,
			startVelocity: 45,
		})
	}, [makeShot])

	const { address } = useAccount()
	const [plot, setPlot] = useState(999)
	const [displayedPlot, setDisplayedPlot] = useState(400)
	const [currentDay, setCurrentDay] = useState(0)
	const [loading, setLoading] = useState(true)
	const [isPlayer, setIsPlayer] = useState<IPlayer>({
		ticket: false,
		lastDayPlayed: 0,
		lastPlot: 444,
		winner: false,
	})

	const notify2 = () => toast('Discovered plot!')

	useEffect(() => fire(), [isPlayer])

	// Current day of Game

	const { data: dataDay, refetch: refetchDay } = useContractRead({
		address: takaraContract,
		abi: takaraABI,
		functionName: 'getCurrentDay',
		watch: true,
		onSuccess(data: number) {
			setCurrentDay(Number(data))
		},
	})

	// Player Status

	const { data: dataPlayer, refetch: refetchPlayer } = useContractRead({
		address: takaraContract,
		abi: takaraABI,
		functionName: 'isPlayer',
		watch: true,
		args: [address!],
		onSuccess(data: [boolean, number, number, boolean]) {
			setDisplayedPlot(Number(data[2]))
			setIsPlayer({
				ticket: data[0],
				lastDayPlayed: Number(data[1]),
				lastPlot: Number(data[2]),
				winner: data[3],
			})
			setLoading(false)
			console.log(isPlayer)
		},
	})

	//Play the game
	// const { write, data: dataDone } = useContractWrite({
	// 	address: takaraContract,
	// 	abi: takaraABI,
	// 	functionName: 'play',
	// 	args: [plot],
	// 	onSuccess(data) {
	// 		notify1()
	// 	},
	// })

	// const {
	// 	data: receipt,
	// 	isLoading: isPending,
	// 	isSuccess,
	// } = useWaitForTransaction({
	// 	hash: dataDone?.hash,
	// 	onSuccess(data) {
	// 		notify2()
	// 		refetchPlayer()
	// 	},
	// })

	const plots = []
	for (let i = 0; i < 81; i++) {
		plots.push(
			isPlayer.ticket &&
				isPlayer.lastDayPlayed === currentDay &&
				i === displayedPlot ? (
				<>
					{!isPlayer.winner ? (
						<span key={i} className='plant carrot'>
							<div className='plant carrot'>
								<div className='bg'></div>
							</div>
						</span>
					) : (
						<span key={i} className='plant radish'>
							<div className='plant radish'>
								<div className='bg'></div>
							</div>
						</span>
					)}
					{isPlayer.winner && (
						<ReactCanvasConfetti
							refConfetti={getInstance}
							style={{
								position: 'fixed',
								pointerEvents: 'none',
								width: '100%',
								height: '100%',
								top: 0,
								left: 0,
							}}
						/>
					)}
				</>
			) : (
				<span
					key={i}
					className='plot'
					onClick={() => {
						isPlayer.ticket && isPlayer.lastDayPlayed !== currentDay
							? write(i)
							: isPlayer.ticket
							? window.alert('You already played today')
							: window.alert('You need a ticket, please go on Account')
					}}
				></span>
			)
		)
	}

	return (
		<div className='flex justify-center m-1'>
			<div id='board'>
				<div id='overlay' className=''>
					{plots}
				</div>
				<div id='soil' className='bg-green-500'>
					{plots}
				</div>
			</div>
		</div>
	)
}
