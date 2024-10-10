import {useState,useEffect} from "react"
import PreferenceOptionForm from "./PreferenceOptionForm"

function Signup(){
    const [error,setError] = useState()
    const [msg, setMsg] = useState()
    const [formData, setFormData] = useState({})
    const [selectedDate,setSelectedDate] = useState()
    const [userInfo, setUserInfo] = useState(true)
    
    function handleInputChange(event){
        const name = event.target.name
        const value = event.target.value
            setFormData((prevData) => ({
                ...prevData, [name]:value,
            }))
        
    }

    function dateInputChange(date){
        setSelectedDate(date)
        
        setFormData((prevData) => ({
            ...prevData, ['date']:date
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
        return ""
    }

    return (
        <div>
            {msg ? <p>{msg}</p> : null}
            <PreferenceOptionForm handleSubmit={handleSubmit} handleInputChange={handleInputChange} dateInputChange={dateInputChange} selectedDate={selectedDate} getDefaultValue={getDefaultValue} userInfo={userInfo}></PreferenceOptionForm>
        </div>

)}

export default Signup;