import { NavLink } from "react-router-dom";
import AppBar from '@mui/material/AppBar';

function NavBar(){
    return (

        <nav className="navBar">
            <NavLink to="/">Home </NavLink>
            <NavLink to="/mymatches">My Matches</NavLink>
            <NavLink to="/myaccount">My Account</NavLink>
            <NavLink to="/calendar">Plan a Date</NavLink>
            <NavLink to="/login" >Login</NavLink>
            <NavLink to="signup">Sign Up</NavLink>
            <NavLink to="/logout">Logout</NavLink>
        </nav>


)}

export default NavBar;