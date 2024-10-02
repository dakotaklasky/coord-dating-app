import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useState,useEffect} from "react"


function AccountPreview({id}){

    const [myDetails, setMyDetails] = useState([])

    useEffect(() =>{
        fetch(`http://127.0.0.1:5555/${id}`) 
        .then(response => response.json())
        .then(json => setMyDetails(json))
    }, [])


    return(
            <Card sx={{maxWidth: 800}}>
            <CardContent>
                <img src={myDetails.image} alt="User Profile Picture"/>
                <h2>{myDetails.username}</h2>
                <p>{myDetails.age}</p>
                <p>{myDetails.bio}</p>
            </CardContent>
        </Card>

    )
}

export default AccountPreview;