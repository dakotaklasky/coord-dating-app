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
        .then(response => {
            if (!response.ok){throw new Error('Network response not ok')}
            else{return response.json()}
        })
        .catch(error =>{console.error('There was a problem')})
        .then(json => setDefaultData(json))
    }, [])  

    if (!defaultData){
        return <p>Please login!</p>
    }
    
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
                'gender': event.target.gender.value,
                'height': event.target.height.value
            })
        })
        .then(response => {
            if (response.ok){setMsg('Update successful')}
            else{
                setMsg('Update failed')
                return Promise.reject(response)
            }
        })
        .catch(response => {console.error('There was a problem')})
    }

    return(
        <div>
            {/* initialize with current values */}
            {msg ? <p>{msg}</p> : null}
            <form onSubmit = {handleSubmit}>
                <label>Image:</label>
                <input type="text" name={"image"} defaultValue = {defaultData['image']}></input><br></br>
                <label>Age:</label>
                <input type="text" name={"age"} defaultValue = {defaultData['age']}></input><br></br>
                <label>Bio:</label>
                <input type="text" name={"bio"} defaultValue={defaultData['bio']} ></input><br></br>
                <label>Gender:</label>
                <input type="text" name={"gender"} defaultValue = {defaultData['gender']}></input><br></br>
                <label>Height:</label>
                <input type="text" name={"height"} defaultValue = {defaultData['height']}></input><br></br>
                <input type="submit" value="Update"></input>
            </form>
        </div>
    )
}

export default AccountForm;