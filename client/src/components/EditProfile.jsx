import {useState,useEffect} from "react"
import PreferenceOptionForm from "./PreferenceOptionForm"
function EditProfile(){

    const [msg, setMsg] = useState()
    const [formData, setFormData] = useState([])
    const [userInfo, setUserInfo] = useState(true)

    // const fetch1 = fetch(`http://127.0.0.1:5555/myaccount`,{
    //     method: "GET",
    //     headers:{
    //         "Content-Type": "application/json",
    //         "Accept": 'application/json'
    //     },
    //     credentials: 'include'
    // })
    // const fetch2 =  fetch(`http://127.0.0.1:5555/user_attributes`,{
    //     method: "GET",
    //     headers:{
    //         "Content-Type": "application/json",
    //         "Accept": 'application/json'
    //     },
    //     credentials: 'include'
    // })
    
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try{
    //             const [response1, response2] = await Promise.all([
    //                 fetch1,fetch2
    //             ])
                
    //             const data1 = await response1.clone().json()
    //             const data2 = await response2.clone().json()
    //             const combined = {...data1,...data2}

    //             setFormData(combined)
    //         }
    //         catch (error){
    //             console.error('Error fetching data:', error)
    //         }
    //     }
    //     fetchData()
    // }, [])

    useEffect(() =>{
        fetch("http://127.0.0.1:5555/myaccount",{
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Accept": 'application/json'
            },
            credentials: 'include',
        }) 
        .then(response => {
            if (!response.ok){throw new Error('Network response not ok')}
            else{return response.json()}
        })
        .catch(error =>{console.error('There was a problem')})
        .then(json => {
            const formDict = {}

            formDict['username'] = json['username']
            formDict['image'] = json['image']
            formDict['bio'] = json['bio']

            for(const row in json['attributes']){
                formDict[json['attributes'][row].attribute_category] = json['attributes'][row].attribute_value
            }
                
            setFormData(formDict)
        })

    }, [])
    
    if (!formData){
        return <p>Please login!</p>
    }
        
        
    function handleInputChange(event){
        const name = event.target.name
        const value = event.target.value
            setFormData((prevData) => ({
                ...prevData, [name]:value,
            }))
    }

    function getDefaultValue(field){
        if(field in formData){
            return formData[field]
        }
    }
        
    function handleSubmit(event){
        event.preventDefault()
        console.log(formData)

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
            <PreferenceOptionForm handleSubmit={handleSubmit} handleInputChange={handleInputChange} getDefaultValue={getDefaultValue} userInfo={userInfo}></PreferenceOptionForm>
        </div>
    )
}

export default EditProfile;