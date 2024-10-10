import {useState,useEffect} from "react"
import MultiRangeSlider from "multi-range-slider-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

function PreferenceOptionForm({handleSubmit,handleInputChange, dateInputChange,selectedDate,getDefaultValue,userInfo}){
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

    const maximumDate = new Date()
    maximumDate.setDate(maximumDate.getDate()-(365*18))
    

    return (
        <div>
            
            <form onSubmit = {handleSubmit}>
                {userInfo ? 
                (<div>
                <label>Username:</label>
                <input type="text" name={"username"} onChange={handleInputChange} defaultValue={getDefaultValue("username")}></input><br/>
                <label>Image:</label>
                <input type="text" name={"image"} onChange={handleInputChange} defaultValue={getDefaultValue("image")}></input><br/>
                <label>Bio:</label>
                <input type="text" name={"bio"} onChange={handleInputChange} defaultValue={getDefaultValue("bio")}></input><br/>
                <label>Birthdate:</label>
                <DatePicker maxDate={maximumDate} selected={selectedDate} onChange={dateInputChange} defaultValue={getDefaultValue("birthdate")}/>
                </div>) :
                (<div></div>)}
                <div>
                    {prefOptions.map((pref,index) => (
                        <div key={index}>
                            <label>{pref.category}</label>
                            {pref.input_type == "dropdown" ? (
                                <select name={pref.category} onChange={handleInputChange} value={getDefaultValue(pref.category)}>
                                   <option value=""></option>
                                   {pref.option_array.map((option,index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                   ))}
                                </select>
                                //replace with slider
                            ) : (<input type="text" name={pref.category} onChange={handleInputChange} defaultValue={getDefaultValue(pref.category)}></input>)
                                }
                        </div>
                    ))}
                </div>
                <input type="submit" value="Sign Up"></input>
            </form>
        </div>
)}

export default PreferenceOptionForm;
