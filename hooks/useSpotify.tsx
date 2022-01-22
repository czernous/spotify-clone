import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
})

const useSpotify = () => {
    const { data: session, status } = useSession()
    useEffect(() => {
        if (session) {
            if (session.error === 'RefreshAccessTokenError') {
                signIn()
            }

            const accessToken: string =
                typeof session.accessToken === 'string'
                    ? session.accessToken
                    : ''

            if (!accessToken.length)
                throw new Error("Access token does't exist")

            spotifyApi.setAccessToken(accessToken)
        }
    }, [session])

    return spotifyApi
}

export default useSpotify
