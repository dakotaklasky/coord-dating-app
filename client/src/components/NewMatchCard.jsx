import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useState,useEffect} from "react"


function UserCard(){

    const [user, setUser] = useState([])
    const [postResponse, setPostResponse] = useState()

    useEffect(() =>{
        fetch("http://127.0.0.1:5555/new_match") //getuserid
        .then(response => response.json())
        .then(json => setUser(json))
    }, [])

    function handleDislike(){
        //post to like table with accepted = -1
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
        .then(response => response.json())
        .then(json => setPostResponse(json))

        //make sure code is 201 then move to next person
    
    }

    function handleLike(){
        //post to like table with accepted = 1
        //if match is returned then show popup that you got a new match - should see new match in my matches
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
            if(response.status == 200){
                console.log("You got a new match!")
            }
            return response.json()
            })
        .then( data =>{
            console.log(data)
        })
        .catch(error =>{
            console.error('There was a problem')
        })

        //add in another call to fetch to re
 
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

export default UserCard