import {adminLoginFields, loginFields} from "../constants/formFields";
import {useState} from "react";
import Input from "./Input";
import axios from "axios";


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

    //Authentication will be done here
    const authenticateAdmin =()=> {

        axios({
            method: 'post',
            url: 'http://localhost:8080/checkadmin',
            data: {
                userName: adminLoginState.username,
                pass: adminLoginState.password
            }
        }).then((response) => {
            console.log(response);
        },
            (error) => {
            console.log(error);
            });
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