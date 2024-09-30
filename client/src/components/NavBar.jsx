import { NavLink } from "react-router-dom";

function NavBar(){
    return <nav className="navBar">
        <NavLink to="/">Home </NavLink>
        <NavLink to="/mymatches">My Matches</NavLink>
        <NavLink to="/plandate">Plan Date</NavLink>
        <NavLink to="/myaccount">My Account</NavLink>
    </nav>
}

export default NavBar;