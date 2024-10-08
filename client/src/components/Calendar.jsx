import React, {useState} from "react";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

function Calendar(){
    const [dateSelection,setDateSelection] = useState(new Date())
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate()+14)
    return (
        <DatePicker selected={dateSelection} onChange={(date) => setDateSelection(date)} showTimeSelect timeIntervals={180} minDate={new Date()} maxDate={maxDate}/>
    )
}

export default Calendar;