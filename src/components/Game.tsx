import { useState } from 'react'
import {
	useAccount,
	usePrepareContractWrite,
	useContractRead,
	useContractWrite,
	useWaitForTransaction,
} from 'wagmi'
import { toast } from 'react-toastify'
import { takaraABI } from '../utils/takaraABI'
import { takaraContract } from '../utils/contracts'

interface IPlayer {
	ticket: boolean
	lastDayPlayed: number
	lastPlot: number
	winner: boolean
}

export const Game = () => {
	const { address } = useAccount()
	const [selectedPlot, selectPlot] = useState(400)
	const [displayedPlot, displayPlot] = useState(400)
	const [currentDay, setCurrentDay] = useState(0)
	const [isPlayer, setIsPlayer] = useState<IPlayer>({
		ticket: false,
		lastDayPlayed: 0,
		lastPlot: 444,
		winner: false,
	})
	const notify1 = () =>
		toast('🦄 You transasaction is sent, please wait the result!')
	const notify2 = () => toast('🥕🥕 were on this plot, try again tomorrow!')

	// Player Status

	const { data: dataPlayer, refetch: refetchPlayer } = useContractRead({
		address: takaraContract,
		abi: takaraABI,
		functionName: 'isPlayer',
		args: [address!],
		watch: true,
		onSuccess(data: [boolean, number, number, boolean]) {
			setIsPlayer({
				ticket: data[0],
				lastDayPlayed: data[1],
				lastPlot: data[2],
				winner: data[3],
			})
		},
	})

	// Current day of Game

	const { data: dataDay, refetch: refetchDay } = useContractRead({
		address: takaraContract,
		abi: takaraABI,
		functionName: 'getCurrentDay',
		watch: true,
		onSuccess(data: number) {
			setCurrentDay(data)
		},
	})

	//Play the game

	const { config, error } = usePrepareContractWrite({
		address: takaraContract,
		abi: takaraABI,
		functionName: 'play',
		args: [selectedPlot],
	})
	const { write, data: dataDone } = useContractWrite({
		...config,
		onSuccess(data) {
			notify1()
		},
	})

	const {
		data: receipt,
		isLoading: isPending,
		isSuccess,
	} = useWaitForTransaction({
		hash: dataDone?.hash,
		onSuccess(data) {
			displayPlot(selectedPlot)
			notify2()
		},
	})

	const plots = []
	for (let i = 0; i < 81; i++) {
		if (i !== displayedPlot)
			plots.push(
				<span
					key={i}
					className='plot'
					onClick={() => {
						selectPlot(i)
						isPlayer.ticket && isPlayer.lastDayPlayed !== currentDay
							? write?.()
							: isPlayer.ticket
							? window.alert('You already played today')
							: window.alert('You need a ticket, please go on Account')
					}}
				></span>
			)
		else
			plots.push(
				isPlayer.winner ? (
					<span key={i} className='plant radish'>
						<div className='plant radish'>
							<div className='bg'></div>
						</div>
					</span>
				) : (
					<span key={i} className='plant carrot'>
						<div className='plant carrot'>
							<div className='bg'></div>
						</div>
					</span>
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
