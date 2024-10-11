import { NavLink } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import { useState} from 'react'



function NavBar(){

    // const [isLoggedIn, setIsLoggedIn] = useState([])

    // fetch('http://127.0.0.1:5555/isloggedin')
    // .then(response => {
    //   if (!response.ok){
    //     setIsLoggedIn(false)
    //   }
    //   else{
    //     setIsLoggedIn(true)
    //   }
    //   console.log('test')
    // })


    return (

        <nav className="navBar">
            <NavLink to="/">Home </NavLink>
            <NavLink to="/mymatches">My Matches</NavLink>
            <NavLink to="/myaccount">My Account</NavLink>
            <NavLink to="/calendar">Plan a Date</NavLink>
            {/* {isLoggedIn ? <NavLink to="/logout" >Logout</NavLink> : <NavLink to="/login" >Login</NavLink>} */}
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/logout">Logout</NavLink>
            <NavLink to="signup">Sign Up</NavLink>
        </nav>


)}

export default NavBar;