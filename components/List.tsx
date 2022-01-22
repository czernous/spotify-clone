import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { shuffle } from 'lodash'
import { useRecoilValue, useRecoilState } from 'recoil'
import { playlistIdState, playlistState } from '../atoms/playlist-atom'
import useSpotify from '../hooks/useSpotify'
import Songs from './Songs'

const List = () => {
    const { data: session, status } = useSession()
    const [color, setColor] = useState<string | undefined>('')
    const colors = [
        'from-red-500',
        'from-pink-500',
        'from-purple-500',
        'from-green-500',
        'from-yellow-500',
        'from-oragnge-500',
        'from-cyan-500',
        'from-indigo-500',
        'from-fuchsia-500',
    ]

    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState<any>(playlistState)
    const spotifyApi = useSpotify()

    useEffect(() => setColor(shuffle(colors).pop()), [playlistId])

    useEffect(() => {
        //if (status !== 'authenticated') return

        spotifyApi
            .getPlaylist(playlistId)
            .then((data: any) => {
                setPlaylist(data.body)
            })
            .catch((err) => console.warn(err.message))
    }, [spotifyApi, playlistId])

    console.log(status)

    return (
        <div className="flex-grow h-screen overflow-y-auto scrollbar-hide">
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-gray-300">
                    <img
                        className="rounded-full w-10 h-10"
                        src={
                            session?.user?.image ??
                            '/images/placeholder_avatar.jpg'
                        }
                        alt="user image"
                    />
                    <h2>{session?.user?.name}</h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>
            <section
                className={`w-full flex items-end space-x-7 bg-gradient-to-b to-black h-80 text-white p-8 ${color}`}
            >
                <div className="relative h-44 w-44 shadow-2xl">
                    <div
                        className="w-[100%] h-[100%] absolute top-0 left-0  animate-pulse
                    from-black bg-gradient-to-r to-gray-600"
                    ></div>
                    <img
                        className="mw-100 mh-100 absolute top-0 left-0"
                        src={playlist?.images?.[0].url}
                        alt=""
                    />
                </div>

                <div>
                    <p>PLAYLIST</p>
                    <h1 className="text-2xl md:text-6xl xl:text-8xl font-bold">
                        {playlist?.name}
                    </h1>
                </div>
            </section>
            <div>
                <Songs />
            </div>
        </div>
    )
}

export default List
