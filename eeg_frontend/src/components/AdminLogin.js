import {adminLoginFields, loginFields} from "../constants/formFields";
import {useState} from "react";
import Input from "./Input";
import axios from "axios";
import AuthService from "../services/AuthService";
import {useNavigate} from "react-router-dom";

const fields = adminLoginFields;
let fieldState = {};
fields.forEach(field=>fieldState[field.id]='');
export default function AdminLogin () {
    const [adminLoginState, setAdminLoginState] = useState(fieldState);

    const handleChange =(e)=>{
        setAdminLoginState({...adminLoginState,[e.target.id]:e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        authenticateAdmin();
    }

    let navigate = useNavigate();
    const routeToUploadPage = () => {
        let path = "/adminpage";
        navigate(path);
    }
    //Authentication will be done here
    const authenticateAdmin = async () => {
        let isAdmin = await AuthService.login(adminLoginState.username, adminLoginState.password);
        if(isAdmin) {
            navigate("/adminpage");
        }
        else {
            // TODO: display error message
            alert("Incorrect credentials.");
        }
    }

    const submitButton = () => {
        return <button type={'button'} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
                       onClick={handleSubmit}
        > {"Login"} </button>
    }

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="-space-y-px">
                {
                    fields.map(field=>
                        <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={adminLoginState[field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                        />

                    )
                }
            </div>
            {submitButton()}

        </form>
    );


}