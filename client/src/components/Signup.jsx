import {useState,useEffect} from "react"

function Signup(){
    const [error,setError] = useState()
    const [msg, setMsg] = useState()
    const [prefOptions, setPrefOptions] = useState([])

    useEffect(() => {
    fetch(`http://127.0.0.1:5555/pref_options`)
    .then(response => {
        if (!response.ok){throw new Error('Network response not ok')}
        else{return response.json()}
    })
    .catch(response => response.json())
    .then(data => {
        data.map(d => {
            if(d.options){
                d['option_array'] = d.options.split(',') 
            }
        })

        setPrefOptions(data)
    })
    },[])

    console.log(prefOptions)
    

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
                'height': event.target.height.value,
                'gender_pref':event.target.gender_pref.value,
                'height_pref':event.target.height_pref.value
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
                <input type="text" name={"username"}></input><br/>
                <label>Image:</label>
                <input type="text" name={"image"}></input><br/>
                <label>Age:</label>
                <input type="text" name={"age"}></input><br/>
                <label>Bio:</label>
                <input type="text" name={"bio"}></input><br/>
                <label>Gender:</label>
                <input type="text" name={"gender"} ></input><br/>
                <label>Height:</label>
                <input type="text" name={"height"}></input><br/><br/>


                <label>Preferences:</label><br></br>
                <div>
                    {prefOptions.map((pref,index) => (
                        <div key={index}>
                            <label>{pref.category}</label>
                            {pref.input_type == "dropdown" ? (
                                <select name={pref.category}>
                                   {pref.option_array.map((option,index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                   ))}
                                </select>
                            ) : (
                                <input type="text" name={pref.category}></input>
                            )}

                        </div>

                    ))}
                </div>



            </form>
            
        </div>
)}

export default Signup;