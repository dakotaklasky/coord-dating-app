
import NavBar from "./components/NavBar"
import {Outlet} from "react-router-dom"


function App(){
    return(
        <html>
            <NavBar/>
            <Outlet/>
        </html>
    )
}

export default App;