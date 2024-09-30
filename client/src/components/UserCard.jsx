import * as React from 'react';
// import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


function UserCard(){
    return(
        <Card sx={{maxWidth: 800}}>
            <CardContent>
                <h1>Image</h1>
                <h2>Dakota</h2>
                <p>details</p>
            </CardContent>
            <CardActions>
                <Button size="small">❌</Button>
                <Button size="small">❤️</Button>
            </CardActions>
        </Card>
    )
}

export default UserCard