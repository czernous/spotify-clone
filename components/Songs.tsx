import React from 'react'
import { useRecoilValue } from 'recoil'
import { playlistState } from '../atoms/playlist-atom'
import Song from './Song'

const Songs = () => {
    const playlist = useRecoilValue<any>(playlistState)

    return (
        <div className="text-white px-8 flex flex-col space-y-1 pb-28">
            {playlist?.tracks.items.map((song: any, idx: number) => (
                <Song key={song.track.id} song={song} order={idx} />
            ))}
        </div>
    )
}

export default Songs
