import { useState } from 'react'
import AccountPreview from "../components/AccountPreview"
import AccountForm from "../components/AccountForm"
import Button from '@mui/material/Button';


function AccountPage() {

    const [accountView,setAccountView] = useState('preview')

    function viewProfile(){
        setAccountView('preview')
    }
    
    function editProfile(){
        setAccountView('edit')
    }

  return (
    <div>
       <Button onClick = {viewProfile}>View Preview</Button>
       <Button onClick = {editProfile}>Edit Profile</Button>
       {accountView == 'preview'? <AccountPreview id={1}/> : <AccountForm/>}
    </div>
  )
}

export default AccountPage;