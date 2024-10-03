import {useState,useEffect} from "react"
function AccountPreferences(){

    const [msg, setMsg] = useState()
    const [defaultPreferences, setDefaultPreferences] = useState([])

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

    const pref_list = []
    for(const i in defaultPreferences){
        pref_list.push([defaultPreferences[i].pref_category,defaultPreferences[i].pref_value])
    }

    
    function handleSubmit(event){
        event.preventDefault()

        const pref_update = {}
        for (const j in pref_list){
            pref_update[pref_list[j][0]]= event.target[pref_list[j][0]].value
        }

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
            <form onSubmit = {handleSubmit}>
                {pref_list.map(([category,value]) => (
                    <div key={category}>
                        <label>{category}</label>
                        <input type="text" name={category} defaultValue = {value}></input>
                        </div>
                ))}
                <input type="submit" value="Update"></input>
            </form>
        </div>
    )
}

export default AccountPreferences;