
import {useState,useEffect} from "react"

function Login(){
    const [error,setError] = useState()
    const [msg, setMsg] = useState()
    

    function handleSubmit(event){
        console.log(event.target.username.value)
        event.preventDefault()

        fetch(`http://127.0.0.1:5555/login`,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                "Accept": 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                'username': event.target.username.value
            })
        })
        .then(response => {
            if (response.ok){
                setMsg('Log in successful!')
            } else{
                setMsg('Log in failed!')
                return Promise.reject(response)
            }
        })
        .catch(response => response.json())
        .then(data => setError(data))
    }

    const errorElement = error ? <p style={{color: 'red'}}>{error.error}</p> : null
    return (
        <div>
            {msg ? <p>{msg}</p> : null}
            {errorElement}
            <form onSubmit = {handleSubmit}>
                <label>Username:</label>
                <input type="text" name={"username"}></input>
                <input type="submit" value="Login"></input>
            </form>
        </div>
)}

export default Login;