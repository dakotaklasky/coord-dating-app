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
        fetch("http://127.0.0.1:5555/new_match",{
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
        .catch(error =>{console.error('There was a problem')})
        .then(json => setUser(json))
    }, [])

    if (!user){
        return <p>Please login!</p>
    }

    if(user.no_users){
        return <p>You went through all the users!</p>
    }


    async function handleDislike(){
        await fetch("http://127.0.0.1:5555/like",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Accept": 'application/json'
            },
            credentials: 'include',
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

        await fetch("http://127.0.0.1:5555/new_match",{
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
        .catch(error =>{console.error('There was a problem')})
        .then(json => setUser(json))

    }

    async function handleLike(){
        await fetch("http://127.0.0.1:5555/like",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            credentials: 'include',
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

        await fetch("http://127.0.0.1:5555/new_match",{
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
        .catch(error =>{console.error('There was a problem')})
        .then(json => setUser(json))
        
    }

    return(
        <Card sx={{maxWidth: 800}}>
            <CardContent>
                <img src={user.image} alt="User Profile Picture"/>
                <h2>{user.username}</h2>
                <p>{user.age} | {user.gender} | {user.height}cm</p>
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