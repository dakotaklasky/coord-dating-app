import {useState,useEffect} from "react"
function AccountForm(){

    const [msg, setMsg] = useState()
    const [defaultData, setDefaultData] = useState([])

    useEffect( () => {
    fetch(`http://127.0.0.1:5555/myaccount`,{
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            "Accept": 'application/json'
        },
        credentials: 'include'
    })
    .then(response => response.json())
    .then(json => setDefaultData(json))}, [])
    
    function handleSubmit(event){
        event.preventDefault()

        fetch(`http://127.0.0.1:5555/myaccount`,{
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
                "Accept": 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                'image': event.target.image.value,
                'age': event.target.age.value,
                'bio': event.target.bio.value,
            })
        })
        .then(response => {
            if (response.ok){
                setMsg('Update successful')
            } else{
                setMsg('Update failed')
                return Promise.reject(response)
            }
        })
        .catch(response => response.json())
    }

    return(
        <div>
            {/* initialize with current values */}
            {msg ? <p>{msg}</p> : null}
            <form onSubmit = {handleSubmit}>
                <label>Image:</label>
                <input type="text" name={"image"} defaultValue = {defaultData['image']}></input>
                <label>Age:</label>
                <input type="text" name={"age"} defaultValue = {defaultData['age']}></input>
                <label>Bio:</label>
                <input type="text" name={"bio"} defaultValue={defaultData['bio']} ></input>
                <input type="submit" value="Update"></input>
            </form>
        </div>
    )
}

export default AccountForm;