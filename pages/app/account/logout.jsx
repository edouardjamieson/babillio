import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'

import Loader from '/components/Loader'
import { auth } from '/functions/firebase'

export default function logout() {

    const router = useRouter()

    useEffect(() => {
        auth.signOut()
        .then(() => {
            window.localStorage.removeItem('babillio_current_course_id')
            window.localStorage.removeItem('babillio_current_group_name')
            router.push('/app/account/login')
        })
    }, [])

    return <Loader/>
}
