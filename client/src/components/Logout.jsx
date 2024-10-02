import {useState, useEffect} from "react"

function Logout(){

    const [isLoggedOut, setIsLoggedOut] = useState()

  
    useEffect( () => {fetch('http://127.0.0.1:5555/logout', {
    method: 'DELETE',
    credentials: 'include',
    headers:{
        "Content-Type": "application/json",
        "Accept": 'application/json'
    }
    })
    .then(resp => {
        if (resp.ok) {setIsLoggedOut(true)} 
        else {setIsLoggedOut(false)}
    })
    } ,[])

    return (<p>{isLoggedOut ? "Logged out successfully" : "Error logging out"}</p>)
}

export default Logout;