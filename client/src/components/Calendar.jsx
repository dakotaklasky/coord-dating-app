import React, {useState} from "react";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

function Calendar(){
    const [dateSelection1,setDateSelection1] = useState(new Date())
    const [dateSelection2,setDateSelection2] = useState(new Date())
    const [dateSelection3,setDateSelection3] = useState(new Date())
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate()+14)
    return (
        <div>
        <DatePicker selected={dateSelection1} onChange={(date) => setDateSelection1(date)} showTimeSelect timeIntervals={180} minDate={new Date()} maxDate={maxDate}/><br/>
        <DatePicker selected={dateSelection2} onChange={(date) => setDateSelection2(date)} showTimeSelect timeIntervals={180} minDate={new Date()} maxDate={maxDate}/><br/>
        <DatePicker selected={dateSelection3} onChange={(date) => setDateSelection3(date)} showTimeSelect timeIntervals={180} minDate={new Date()} maxDate={maxDate}/>
        </div>
    )
}

export default Calendar;