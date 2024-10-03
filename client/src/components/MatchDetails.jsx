import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useState,useEffect} from "react"


function UserDetails({id}){

    const [userDetails, setUserDetails] = useState([])

    useEffect(() =>{
        fetch(`http://127.0.0.1:5555/${id}`) 
        .then(response => response.json())
        .then(json => setUserDetails(json))
    }, [])


    return(
            <Card sx={{maxWidth: 800}}>
            <CardContent>
                <img src={userDetails.image} alt="User Profile Picture"/>
                <h2>{userDetails.username}</h2>
                <p>{userDetails.age} | {userDetails.gender} | {userDetails.height}</p>
                <p>{userDetails.bio}</p>
            </CardContent>
        </Card>

    )
}

export default UserDetails;