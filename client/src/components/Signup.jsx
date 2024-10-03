import {useState,useEffect} from "react"

function Signup(){
    const [error,setError] = useState()
    const [msg, setMsg] = useState()
    

    function handleSubmit(event){
        console.log(event.target.username.value)
        event.preventDefault()

        fetch(`http://127.0.0.1:5555/signup`,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                "Accept": 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                'username': event.target.username.value,
                'image': event.target.image.value,
                'age': event.target.age.value,
                'bio': event.target.bio.value,
                'gender': event.target.gender.value,
                'height': event.target.height.value
            })
        })
        .then(response => {
            if (response.ok){
                setMsg('Sign up successful!')
            } else{
                setMsg('Sign up failed!')
                return Promise.reject(response)
            }
        })
        .catch(response => response.json())
        .then(data => setError(data))
    }

    return (
        <div>
            {msg ? <p>{msg}</p> : null}
            <form onSubmit = {handleSubmit}>
                <label>Username:</label>
                <input type="text" name={"username"}></input><br></br>
                <label>Image:</label>
                <input type="text" name={"image"}></input><br></br>
                <label>Age:</label>
                <input type="text" name={"age"}></input><br></br>
                <label>Bio:</label>
                <input type="text" name={"bio"}></input><br></br>
                <label>Gender:</label>
                <input type="text" name={"gender"} ></input><br></br>
                <label>Height:</label>
                <input type="text" name={"height"}></input><br></br>
                <input type="submit" value="Sign Up"></input>
            </form>
        </div>
)}

export default Signup;