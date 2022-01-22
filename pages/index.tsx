import { getSession, GetSessionParams } from 'next-auth/react'
import { AppContext } from 'next/app'
import Head from 'next/head'
import List from '../components/List'
import Sidebar from '../components/Sidebar'
import Player from '../components/Player'

export default function Home() {
    return (
        <div className="bg-black h-screen overflow-hidden">
            <Head>
                <title>Spotify 2.0</title>
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>
            <main className="flex">
                <Sidebar />
                <List />
            </main>
            <div className="sticky bottom-0">
                <Player />
            </div>
        </div>
    )
}

export async function getServerSideProps(
    context: GetSessionParams | undefined
) {
    const session = await getSession(context)

    return {
        props: {
            session,
        },
    }
}
