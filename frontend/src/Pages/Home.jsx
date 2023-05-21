import React, { useEffect } from 'react'
import Login from './Login'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()

    const loggedIn = false

    //check auth,then redirect

    useEffect(() => {
        if (!loggedIn) {
            navigate('/login')
        }
    }, [])

    return <div>Home</div>
}

export default Home
