import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/song-atom'
import useSpotify from '../hooks/useSpotify'
import useSongInfo from '../hooks/useSongInfo'
import {
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    RewindIcon,
    SwitchHorizontalIcon,
    VolumeUpIcon,
} from '@heroicons/react/solid'

import { VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline'
import { debounce } from 'lodash'
const Player = () => {
    const spotifyApi = useSpotify()
    const { data: sesson, status } = useSession()
    const [currentTrackId, setCurrentTrackId] =
        useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volume, setVolume] = useState(50)

    const songInfo: any = useSongInfo()

    const getCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data: any) => {
                setCurrentTrackId(data.body?.item?.id)
                console.log('Now playing', data.body?.item)
                spotifyApi.getMyCurrentPlaybackState().then((data: any) => {
                    setIsPlaying(data.body?.is_playing)
                })
            })
        }
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            getCurrentSong()
            setVolume(50)
        }
    }, [currentTrackId, spotifyApi, sesson])

    const handlePlayBack = () => {
        spotifyApi
            .getMyCurrentPlaybackState()
            .then((data: any) => {
                console.log(data)
                if (data.body?.is_playing) {
                    spotifyApi.pause()
                    setIsPlaying(false)
                } else {
                    spotifyApi.play()
                    setIsPlaying(true)
                }
            })
            .catch((err) => console.warn(err.message))
    }

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi
                .setVolume(volume)
                .catch((err) => console.warn(err.message))
        }, 500),
        []
    )

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume)
        }
    }, [volume])

    return (
        <div
            className="h-24 bg-gradient-to-b from-black to-gray-900 text-
        grid grid-cols-3 text-xs md:text-base px-2 md:px-8 text-white"
        >
            <div className="flex items-center space-x-4">
                <div className="hidden md:inline h-10 w-10">
                    <img
                        className="h-10 w-10"
                        src={songInfo?.album?.images[0].url}
                        alt=""
                    />
                </div>
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
            {/* controls */}
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon className="button" />
                {isPlaying ? (
                    <PauseIcon
                        onClick={handlePlayBack}
                        className="button h-10 w-10"
                    />
                ) : (
                    <PlayIcon
                        onClick={handlePlayBack}
                        className="button h-10 w-10"
                    />
                )}
                <FastForwardIcon className="button" />
                <ReplyIcon className="button" />
            </div>
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon
                    onClick={() => {
                        volume > 0 && setVolume(volume - 10)
                    }}
                    className="button"
                />
                <input
                    className="w-14 md:w-28"
                    type="range"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    min={0}
                    max={100}
                />
                <VolumeUpIcon
                    onClick={() => {
                        volume < 100 && setVolume(volume + 10)
                    }}
                    className="button"
                />
            </div>
        </div>
    )
}

export default Player
