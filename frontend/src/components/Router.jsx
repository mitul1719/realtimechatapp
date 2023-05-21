import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../Pages/Home'
import Layout from './Layout'
import Login from '../Pages/Login'

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout component={<Home />} />} />
            <Route path="/login" element={<Layout component={<Login />} />} />
        </Routes>
    )
}

export default Router
