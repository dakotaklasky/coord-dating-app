import {useState,useEffect} from "react"
import MultiRangeSlider from "multi-range-slider-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

function PreferenceOptionForm({handleSubmit,handleInputChange,getDefaultValue,userInfo, handleSliderChange}){
    const [error,setError] = useState()
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

        if(userInfo){
            const data_copy = []
            for (const j in data){
                if (data[j].category != "Age"){
                    data_copy.push(data[j])
                }
            }
            setPrefOptions(data_copy)
        }
        else{
            setPrefOptions(data)
        }

    })
    },[])
    
    return (
        <div>
            
            <form onSubmit = {handleSubmit}>
                {userInfo ? 
                (<div>
                <label>Username:</label>
                <input type="text" name={"username"} onChange={handleInputChange} defaultValue={getDefaultValue("username")}></input><br/>
                <label>Password:</label>
                <input type="password" name={"password"} onChange={handleInputChange}></input><br/>
                <label>Image:</label>
                <input type="text" name={"image"} onChange={handleInputChange} defaultValue={getDefaultValue("image")}></input><br/>
                <label>Bio:</label>
                <input type="text" name={"bio"} onChange={handleInputChange} defaultValue={getDefaultValue("bio")}></input><br/>
                <label>Birthdate:</label>
                <input type="date" name={"birthdate"} onChange={handleInputChange} defaultValue={getDefaultValue("Birthdate")}></input><br/><br/>
                </div>) :
                (<div></div>)}
                <div>
                    {prefOptions.map((pref,index) => (
                        
                        <div key={index}>
                            <label>{pref.category}</label>
                            {pref.input_type == "dropdown" ? (
                                <select name={pref.category} onChange={handleInputChange} value = {getDefaultValue(pref.category) || ""}>
                                   <option value=""></option>
                                   {pref.option_array.map((option,index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                   ))}
                                </select>
                            ) : (
                                userInfo ? 
                            (<input type="text" name={pref.category} onChange={handleInputChange} value={getDefaultValue(pref.category) || ""}></input>):
                            (<MultiRangeSlider name={pref.category} min={pref.minval} max={pref.maxval} onChange={handleSliderChange} minValue={getDefaultValue(pref.category) ? Math.min(...getDefaultValue(pref.category).map(Number)): ""} maxValue={getDefaultValue(pref.category) ? Math.max(...getDefaultValue(pref.category).map(Number)):""}/>)

                                )
                                }
                        </div>
                    ))}
                </div>
                <input type="submit" value="Update"></input>
            </form>
        </div>
)}

export default PreferenceOptionForm;
