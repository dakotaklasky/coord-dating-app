import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useState,useEffect} from "react"


function AccountPreview(){

    const [myDetails, setMyDetails] = useState([])
    const [userAttributes, setUserAttributes] = useState([])

    useEffect(() =>{
        fetch(`http://127.0.0.1:5555/myaccount`,{
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
        .catch(error => {console.error('There was a problem')})
        .then(json => setMyDetails(json))

        fetch(`http://127.0.0.1:5555/user_attributes`,{
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
        .then(json => setUserAttributes(json))
    }, [])

    if(!myDetails){
        return (<p>Please login!</p>)
    }

    function calculateAge(birthDate) {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
      
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
      
        // If the birthday hasn't happened this year, subtract 1
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
          age--;
        }
      
        return String(age);
      }

    return(
            <Card sx={{maxWidth: 800}}>
            <CardContent>
                <img src={myDetails.image} alt="User Profile Picture"/>
                <h2>{myDetails.username}</h2>
                <p>{myDetails.bio}</p>
                {Object.entries(userAttributes).map(([key,value]) => (
                    key == "Birthdate" ?
                    <p key={key}>{calculateAge(value)}</p> :
                    <p key={key}>{value}</p>
                ))}
            </CardContent>
        </Card>

    )
}

export default AccountPreview;