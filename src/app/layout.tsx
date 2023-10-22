import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
	title: 'Takara',
	description: 'Takara, Find the Radish',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang='en'
			className={`bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 {inter.className}`}
		>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
