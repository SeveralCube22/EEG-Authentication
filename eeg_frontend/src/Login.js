import Header from "./components/Header.js";
import Login from "./components/Login";
export default function LoginPage(){
    return(
        <>
            <Header
                heading= "Login with EEG headset"
                paragraph= "This is the EEG login page, you need a headset to use it."
                linkName= "Github Repo"
                linkUrl = "https://github.com/SeveralCube22/EEG-Authentication"
            />
            <Login/>
        </>
    );
}