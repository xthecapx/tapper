import Head from 'next/head'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import TapperTracker from '@/components/TapperTracker'
import { useEffect, useState } from 'react'

export default function Home() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const [redirectTo, setRedirectTo] = useState<string>('')

  useEffect(() => {
    // Set redirect URL on client side to avoid SSR issues
    setRedirectTo(`${window.location.origin}/api/auth/callback`)
  }, [])

  return (
    <>
      <Head>
        <title>Rastreador de Tappers - Salón de la Vergüenza</title>
        <meta name="description" content="Expón a tus amigos tappers y avergüénzalos públicamente" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full h-full bg-200">
        {!session ? (
          <div className="min-w-full min-h-screen flex items-center justify-center">
            <div className="w-full h-full flex justify-center items-center p-4">
              <div className="w-full h-full sm:h-auto sm:w-2/5 max-w-sm p-5 bg-white shadow flex flex-col text-base">
                <span className="font-sans text-3xl text-center pb-2 mb-1 border-b mx-4 align-center">
                  Salón de la Vergüenza 😈
                </span>
                <Auth 
                  supabaseClient={supabase} 
                  appearance={{ theme: ThemeSupa }} 
                  theme="dark"
                  redirectTo={redirectTo}
                  providers={[]}
                  onlyThirdPartyProviders={false}
                  magicLink={true}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full min-h-screen flex flex-col">
            <div className="flex-1">
              <TapperTracker session={session} />
            </div>
            <div className="p-4 border-t bg-gray-50">
              <button
                className="btn-black w-full max-w-md mx-auto block text-sm sm:text-base py-2 sm:py-3"
                onClick={async () => {
                  const { error } = await supabase.auth.signOut()
                  if (error) console.log('Error logging out:', error.message)
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
