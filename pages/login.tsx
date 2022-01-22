import React from 'react'
import { getProviders, signIn } from 'next-auth/react'
import { GetServerSideProps } from 'next/types'

function Login({ providers }: any) {
    return (
        <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
            <img
                className="w-52 mb-5"
                src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                alt="logo"
            />
            {Object.values(providers).map((provider: any) => {
                return (
                    <div key={provider.name}>
                        <button
                            className="bg-[#16d860] text-white p-5 rounded-full"
                            onClick={() =>
                                signIn(provider.id, { callbackUrl: '/' })
                            }
                        >
                            Login with {provider.name}
                        </button>
                    </div>
                )
            })}
        </div>
    )
}

export default Login

export const getServerSideProps: GetServerSideProps<{
    providers: any
}> = async () => {
    return {
        props: {
            providers: await getProviders(),
        },
    }
}
