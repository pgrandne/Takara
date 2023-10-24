import { useState } from 'react'
import {
	useAccount,
	usePrepareContractWrite,
	useContractRead,
	useContractWrite,
	useWaitForTransaction,
} from 'wagmi'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { takaraABI } from '../utils/takaraABI'
import { takaraContract } from '../utils/contracts'

export const Game = () => {
	const { address } = useAccount()
	const [selectedPlot, selectPlot] = useState(400)
	const [isPlayer, setIsPlayer] = useState(false)
	const notify1 = () =>
		toast('🦄 You transasaction is sent, please wait the result!')
	const notify2 = () => toast('🥕🥕 were on this plot, try again tomorrow!')

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
			selectPlot(28)
			notify2()
		},
	})

	const plots = []
	for (let i = 0; i < 81; i++) {
		if (i !== selectedPlot)
			plots.push(
				<span
					key={i}
					className='plot'
					onClick={() => {
						selectPlot(i)
						isPlayer
							? write?.()
							: window.alert('You need a ticket, please go on Account')
					}}
				></span>
			)
		else
			plots.push(
				<span key={i} className='plant carrot'>
					<div className='plant carrot'>
						<div className='bg'></div>
					</div>
				</span>
			)
	}

	return (
		<>
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
			<ToastContainer position='bottom-right' />
		</>
	)
}
