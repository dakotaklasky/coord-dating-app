import {useState,useEffect} from "react"
import PreferenceOptionForm from "./PreferenceOptionForm"

function Signup(){
    const [error,setError] = useState()
    const [msg, setMsg] = useState()
    const [formData, setFormData] = useState({})
    const [userInfo, setUserInfo] = useState(true)
    
    function handleInputChange(event){
        const name = event.target.name
        const value = event.target.value
            setFormData((prevData) => ({
                ...prevData, [name]:value,
            }))  
    }

    function handleSubmit(event){
        event.preventDefault()

        fetch(`http://127.0.0.1:5555/signup`,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                "Accept": 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
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

    function getDefaultValue(){
     
    }

    return (
        <div>
            {msg ? <p>{msg}</p> : null}
            <PreferenceOptionForm handleSubmit={handleSubmit} handleInputChange={handleInputChange} getDefaultValue={getDefaultValue} userInfo={userInfo}></PreferenceOptionForm>
        </div>

)}

export default Signup;