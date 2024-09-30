import { useState } from 'react'
import MatchDetails from "../components/MatchDetails"
import {useParams} from "react-router-dom"

function MatchProfilePage() {

    const params = useParams()
    const id = params.id

    return (
        <div>
        <MatchDetails id={id}></MatchDetails>
        </div>
  )
}

export default MatchProfilePage;