import { useRouter } from 'next/dist/client/router'
import Loader from '/components/Loader'
import { useEffect } from 'react'
export default function index() {
    const router = useRouter()
    useEffect(() => {
        router.push('/app/account/login')
    }, [])
    return <Loader/>
}
