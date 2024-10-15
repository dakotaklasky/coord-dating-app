import React, {useState} from "react";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

function Calendar(){
    const [dateSelection1,setDateSelection1] = useState(new Date())
    const [dateSelection2,setDateSelection2] = useState(new Date())
    const [dateSelection3,setDateSelection3] = useState(new Date())
    const [msg, setMsg] = useState()
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate()+14)

    function handleSubmit(event){
        event.preventDefault()

        fetch(`http://127.0.0.1:5555/user_attributes`,{
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
                "Accept": 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                'Date': [dateSelection1,dateSelection2,dateSelection3]
            })
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



    return (
        <div>
            <form onSubmit = {handleSubmit}>
                <DatePicker selected={dateSelection1} onChange={(date) => setDateSelection1(date)} showTimeSelect timeIntervals={180} minDate={new Date()} maxDate={maxDate}/><br/>
                <DatePicker selected={dateSelection2} onChange={(date) => setDateSelection2(date)} showTimeSelect timeIntervals={180} minDate={new Date()} maxDate={maxDate}/><br/>
                <DatePicker selected={dateSelection3} onChange={(date) => setDateSelection3(date)} showTimeSelect timeIntervals={180} minDate={new Date()} maxDate={maxDate}/><br/><br/>
                <input type="submit" value="Update"></input>
            </form>
        </div>
    )
}

export default Calendar;