import {useState,useEffect} from "react"
import PreferenceOptionForm from "./PreferenceOptionForm"

function AccountPreferences(){

    const [msg, setMsg] = useState()
    const [formData, setFormData] = useState([])
    const [userInfo,setUserInfo] = useState(false)


    useEffect( () => {
        fetch(`http://127.0.0.1:5555/mypreferences`,{
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
        .then(json => setFormData(json))
    }, [])  

    if (!formData){
        return <p>Please login!</p>
    }

    function getDefaultValue(field){
        if(field in formData){
            return formData[field]
            }
    }

    function handleInputChange(event){
        const name = event.target.name
        const value = event.target.value
            setFormData((prevData) => ({
                ...prevData, [name]:value,
            }))
    }

    function handleSliderChange(event){
        const name = event.name
        const minval = event.minValue
        const maxval = event.maxValue
        setFormData((prevData) => ({
            ...prevData, [name]:minval, [name]: maxval,
        }))
    }

    
    function handleSubmit(event){
        event.preventDefault()

        fetch(`http://127.0.0.1:5555/mypreferences`,{
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
            <PreferenceOptionForm handleSubmit={handleSubmit} handleInputChange={handleInputChange} getDefaultValue={getDefaultValue} userInfo={userInfo} handleSliderChange={handleSliderChange}></PreferenceOptionForm>
        </div>
    )
}

export default AccountPreferences;