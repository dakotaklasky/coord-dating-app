import {useState,useEffect} from "react"
import PreferenceOptionForm from "./PreferenceOptionForm"
function EditProfile(){

    const [msg, setMsg] = useState()
    const [defaultUserData, setDefaultUserData] = useState([])
    const [defaultAttributeData, setDefaultAttributeData] = useState([])
    const [selectedDate,setSelectedDate] = useState([])
    const [formData, setFormData] = useState({})
    const [userInfo, setUserInfo] = useState(true)
    
    function handleInputChange(event){
        const name = event.target.name
        const value = event.target.value
            setFormData((prevData) => ({
                ...prevData, [name]:value,
            }))
        
    }

    function dateInputChange(date){
        setSelectedDate(new Date(date))
        
        setFormData((prevData) => ({
            ...prevData, ['birthdate']:date
        }))
    }


    
    useEffect(() => {
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
        .then(json => setDefaultUserData(json))

        setSelectedDate(defaultUserData["birthdate"])
    
        fetch(`http://127.0.0.1:5555/user_attributes`,{
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
        .then(json => setDefaultAttributeData(json))
    
        if (!defaultUserData){
            return <p>Please login!</p>
        }
        
    },[]) 

    function getDefaultValue(field){
        if(field in defaultUserData){
            return defaultUserData[field]
        }
        else if(field in defaultAttributeData){
            return defaultAttributeData[field]
        }
    
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
            body: JSON.stringify(formData)
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
            {msg ? <p>{msg}</p> : null}
            <PreferenceOptionForm handleSubmit={handleSubmit} handleInputChange={handleInputChange} dateInputChange={dateInputChange} selectedDate={selectedDate} getDefaultValue={getDefaultValue} userInfo={userInfo}></PreferenceOptionForm>
        </div>
    )
}

export default EditProfile;