import { useState } from 'react'
import {
	usePrepareContractWrite,
	useContractWrite,
	useWaitForTransaction,
} from 'wagmi'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { takaraABI } from '../utils/takaraABI'

export const Game = () => {
	const notify1 = () =>
		toast('🦄 You transasaction is sent, please wait the result!')
	const notify2 = () => toast('🥕🥕 were on this plot, try again tomorrow!')

	const { config, error } = usePrepareContractWrite({
		address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
		abi: takaraABI,
		functionName: 'deposit',
		args: [100],
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
	const [selectedPlot, selectPlot] = useState(400)
	const [contractPlot, setContractPlot] = useState(0)
	for (let i = 0; i < 81; i++) {
		if (i !== selectedPlot)
			plots.push(
				<span key={i} className='plot' onClick={() => write?.()}></span>
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
