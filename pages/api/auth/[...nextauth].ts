import NextAuth, { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import SpotifyProvider from 'next-auth/providers/spotify'
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify'

async function refreshAccessToken(token: JWT): Promise<JWT> {
    const refreshToken: string =
        typeof token.refreshToken === 'string' ? token.refreshToken : ''
    const accessToken: string =
        typeof token.accessToken === 'string' ? token.accessToken : ''
    try {
        spotifyApi.setAccessToken(accessToken)
        spotifyApi.setRefreshToken(refreshToken)

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken()

        console.log('REFRESHED TOKEN IS: ', refreshedToken)
        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        }
    } catch (e) {
        console.error(e)

        return {
            ...token,
            error: 'RefreshTokenError',
        }
    }
}

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID
                ? process.env.NEXT_PUBLIC_CLIENT_ID
                : '',
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET
                ? process.env.NEXT_PUBLIC_CLIENT_SECRET
                : '',
            authorization: LOGIN_URL,
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                const date = new Date()
                const expiresAt = account.expires_at
                    ? account.expires_at
                    : date.getTime() + 6.048e8
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: expiresAt * 1000,
                }
            }

            const accessTokenExpires: number | null =
                typeof token.accessTokenExpires === 'number'
                    ? token.accessTokenExpires
                    : null

            if (!accessTokenExpires)
                throw new Error('AccessTokenExpires is NULL')

            if (Date.now() < accessTokenExpires) {
                console.log('EXISTING TOKEN IS VALID')
                return token
            }

            console.log('EXISTING TOKEN HAS EXPIRED')
            return await refreshAccessToken(token)
        },

        async session({ session, user, token }): Promise<Session> {
            session.accessToken = token.accessToken
            session.refreshToken = token.refreshToken
            session.username = token.username
            return session
        },
    },
})
