import {useState,useEffect} from "react"
import PreferenceOptionForm from "./PreferenceOptionForm"

function AccountPreferences(){

    const [msg, setMsg] = useState()
    const [defaultPreferences, setDefaultPreferences] = useState([])
    const [formData, setFormData] = useState([])
    const [selectedDate,setSelectedDate] = useState(defaultPreferences['age'])
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
        .then(json => setDefaultPreferences(json))
    }, [])  

    if (!defaultPreferences){
        return <p>Please login!</p>
    }

    function getDefaultValue(field){
        
      if(field in defaultPreferences){
            return defaultPreferences[field]
        }
        else{
            return ""
        }
    
    }

    //form data should be default data

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


        fetch(`http://127.0.0.1:5555/mypreferences`,{
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
                "Accept": 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(pref_update)
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
            {/* <form onSubmit = {handleSubmit}>
                {pref_list.map(([category,value]) => (
                    <div key={category}>
                        <label>{category}</label>
                        <input type="text" name={category} defaultValue = {value}></input>
                        </div>
                ))}
                <input type="submit" value="Update"></input>
            </form> */}
        </div>
    )
}

export default AccountPreferences;