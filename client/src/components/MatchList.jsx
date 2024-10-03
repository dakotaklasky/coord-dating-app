import * as React from 'react';
import {useState,useEffect} from "react"
import { NavLink } from 'react-router-dom';

function MatchList(){

    const [myData,setMyData] = useState({})

    useEffect(() =>{
        fetch("http://127.0.0.1:5555/matches",{
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
        .then(json => setMyData(json))
    }, [])

    if(!myData){
        return <p>Please login!</p>
    }

    const matches = []
    for (let m in myData){
        matches.push([myData[m].username,myData[m].id])
    }

    return(
        <ul>
            {matches.map((match,index) => (<li key={index}><NavLink to={"/"+ match[1]}>{match[0]}</NavLink></li>))}
        </ul>
    )
}

export default MatchList;