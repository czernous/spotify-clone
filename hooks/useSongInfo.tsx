import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState } from '../atoms/song-atom'
import useSpotify from './useSpotify'

const useSongInfo = () => {
    const spotifyApi = useSpotify()
    const [currentTrackId, setCurrentTrackId] =
        useRecoilState(currentTrackIdState)

    const [songInfo, setSongInfo] = useState(null)

    useEffect(() => {
        const getSongInfo = async () => {
            if (currentTrackId) {
                const trackInfo = await fetch(
                    `https://api.spotify.com/v1/tracks/${currentTrackId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
                        },
                    }
                ).then((response) => response.json())

                setSongInfo(trackInfo)
            }
        }
        getSongInfo()
    }, [currentTrackId, spotifyApi])

    return songInfo
}

export default useSongInfo
