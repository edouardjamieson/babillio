import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'

import Loader from '../../components/Loader'
import { auth } from '../../functions/firebase'

export default function logout() {

    const router = useRouter()

    useEffect(() => {
        auth.signOut()
        .then(() => {
            router.push('/account/login')
        })
    }, [])

    return <Loader/>
}
