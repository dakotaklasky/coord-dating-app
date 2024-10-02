import * as React from 'react';
import {useState,useEffect} from "react"
import { NavLink } from 'react-router-dom';

function MatchList(){

    const [myData,setMyData] = useState({})

    useEffect(() =>{
        fetch("http://127.0.0.1:5555/1/matches") 
        .then(response => response.json())
        .then(json => setMyData(json))
    }, [])

    const matches = []
    for (let m in myData){
        matches.push([myData[m].username,myData[m].id])
    }

    
 

    //console.log(matches)
        

    return(
        <ul>
            {matches.map((match,index) => (<li><NavLink key={index} to={"/"+ match[1]}>{match[0]}</NavLink></li>))}
        </ul>
    )
}

export default MatchList;