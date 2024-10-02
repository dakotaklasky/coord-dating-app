import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useState,useEffect} from "react"


function NewMatchCard(){

    const [user, setUser] = useState([])

    useEffect(() =>{
        fetch("http://127.0.0.1:5555/new_match") 
        .then(response => response.json())
        .then(json => setUser(json))
    }, [])



    function handleDislike(){
        fetch("http://127.0.0.1:5555/like",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Accept": 'application/json'
            },
            body: JSON.stringify({
                matchee_id: user.id,
                accepted: -1
            })
        })
        .then(response => {
            if (!response.ok){throw new Error('Network response not ok')}
            })
        .catch(error =>{
            console.error('There was a problem')
            })
        
        fetch("http://127.0.0.1:5555/new_match") 
        .then(response => response.json())
        .then(json => setUser(json))

        
    }

    function handleLike(){
        fetch("http://127.0.0.1:5555/like",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                matchee_id: user.id,
                accepted: 1,
            })
        })
        .then(response => {
            if (!response.ok){
                throw new Error('Network response not ok')
            }
            return response.json()})
        .then(data =>{
            if (data['MatchFlag'] == 1){
                alert(`You matched with ${user.username}`)
            }
        })
        .catch(error =>{
            console.error('There was a problem')
        })

        fetch("http://127.0.0.1:5555/new_match") 
            .then(response => response.json())
            .then(json => setUser(json))
        
    }

    return(
        <Card sx={{maxWidth: 800}}>
            <CardContent>
                <img src={user.image} alt="User Profile Picture"/>
                <h2>{user.username}</h2>
                <p>{user.age}</p>
                <p>{user.bio}</p>
            </CardContent>
            <CardActions>
                <Button id="dislike" onClick = {handleDislike}>❌</Button>
                <Button id="like" onClick = {handleLike}>❤️</Button>
            </CardActions>
        </Card>
    )
}

export default NewMatchCard