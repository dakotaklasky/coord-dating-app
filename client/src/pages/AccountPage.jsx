import { useState } from 'react'
import AccountPreview from "../components/AccountPreview"
import EditProfile from "../components/EditProfile"
import Button from '@mui/material/Button';
import AccountPreferences from "../components/AccountPreferences"


function AccountPage() {

    const [accountView,setAccountView] = useState('preview')

    function viewProfile(){
        setAccountView('preview')
    }
    
    function editProfile(){
        setAccountView('edit_profile')
    }

    function editPreferences(){
        setAccountView('edit_preference')
    }

  return (
    <div>
       <Button onClick = {viewProfile}>View Preview</Button>
       <Button onClick = {editProfile}>Edit Profile</Button>
       <Button onClick = {editPreferences}>Edit Preferences</Button>
       {accountView == 'preview'? <AccountPreview /> : accountView == 'edit_profile' ?<EditProfile/> : <AccountPreferences/>}
    </div>
  )
}

export default AccountPage;