import Header from "./components/Header.js";
import AdminLogin from "./components/AdminLogin";

export default function AdminLoginPage () {
    return(
        <>
            <Header
                heading= "Admin Login"
                paragraph= "This page is for admin users only."
                linkName= "Github Repo"
                linkUrl = "https://github.com/SeveralCube22/EEG-Authentication"
            />
            <AdminLogin/>
        </>
    );
}