import Feed from "../pages/Feed"
import Dashboard from "../pages/user/Dashboard"
import SignIn from "../pages/user/SignIn"
import SignUp from "../pages/user/SignUp"
import {  Route, Routes } from "react-router-dom"



const Layout = () => {
  return (
    <Routes>
    <Route path="/" element={<Feed />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    </Routes>
  )
}

export default Layout