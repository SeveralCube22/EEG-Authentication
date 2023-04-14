import {useEffect, useState} from "react";
import { loginFields } from "../constants/formFields";
import Input from "./Input";
import startEmotiveClient from "../App"
import {EEDataGraph, Graph} from "./EEGDataGraph";

const fields=loginFields;
let fieldsState = {};
fields.forEach(field=>fieldsState[field.id]='');

export default function Login({emotivManager, eegData}) {
    const [loginState,setLoginState] = useState(fieldsState);
    const [showGraph, setShowGraph] = useState(false);

    const handleChange=(e)=>{
        setLoginState({...loginState,[e.target.id]:e.target.value})
    }

    const handleSubmit = e => {
        e.preventDefault();
        authenticateUser();
    }

    //Include login API integration here
    const authenticateUser =  () => {
        //await emotivManager.init();
        emotivManager.subscribe();
        setTimeout( () => {
            console.log("STOPPED");
            emotivManager.unsubscribe();

        }, 5000);
    }

    useEffect(() => {
        if(eegData['time'].length > 0) setShowGraph(true);
    }, [eegData])

    const submitButton = () => {
        return <button type={'button'} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
                       onClick={handleSubmit}
        > {"Record EEG To Login"} </button>
    }

    return(
        <form className="mt-8 space-y-6">
            <div className="-space-y-px">
                {
                    fields.map(field=>
                        <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={loginState[field.id]}
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
            {showGraph ? <EEDataGraph eegData={eegData}/> : <div/>}
        </form>
    );
}