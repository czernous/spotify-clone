import { NextApiRequest } from 'next'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

declare module 'next' {
    interface NextApiRequest {
        nextUrl: any
    }
}

export async function middleware(req: NextApiRequest) {
    if (!process.env.JWT_SECRET) throw new Error('Failed to get JWT_SECRET')

    const token = await getToken({ req, secret: process.env.JWT_SECRET })

    const { pathname } = req.nextUrl

    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next()
    }

    if (token && pathname !== '/login') {
        return NextResponse.redirect('/')
    }

    if (!token && pathname !== '/login') {
        return NextResponse.redirect('/login')
    }
}
