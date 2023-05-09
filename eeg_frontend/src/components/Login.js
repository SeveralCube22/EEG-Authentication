import {useEffect, useRef, useState} from "react";
import { loginFields } from "../constants/formFields";
import Input from "./Input";
import {EEGDataGraph} from "./EEGDataGraph";
import {useNavigate} from "react-router-dom";
import EmotivManager from "../services/EmotivManager";
import {CLIENT_ID, CLIENT_SECRET} from "../constants/EmotivCreds";
import ModelService from "../services/ModelService";

const fields=loginFields;
let fieldsState = {};
fields.forEach(field=>fieldsState[field.id]='');

export default function Login({setEEGData, eegData}) {
    const [loginState,setLoginState] = useState(fieldsState);
    const [showGraph, setShowGraph] = useState(false);

    const eegDataRef = useRef(eegData);
    eegDataRef.current = eegData;

    const handleChange=(e)=>{
        setLoginState({...loginState,[e.target.id]:e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await authenticateUser();
    }

    //Include login API integration here
    const authenticateUser =  async () => {
        let emotivManager = new EmotivManager(CLIENT_ID, CLIENT_SECRET, setEEGData);
        await emotivManager.init();
        await emotivManager.subscribe();
        setTimeout( () => {
            emotivManager.unsubscribe()
                .then(() => emotivManager.closeSession())
                .then(() => emotivManager.disconnect())
                .then(() => {
                    let data = eegDataRef.current['eeg'];
                    return ModelService.getId(loginState.email, data)
                })
                .then((res) => routeToHome()) //no longer prints "res" to console
                .catch((err) => alert(err)); //TODO: Display error message, simple alert for now

        }, 61000);
    }

    const routeToHome = () => {
        let path = "/home";
        navigate(path);
    }

    let navigate = useNavigate();
    const routeToAdmin = () => {
        let path = "/admin";
        navigate(path);
    }

    useEffect(() => {
        if(eegData['time'].length > 0) setShowGraph(true);
    }, [eegData])

    const submitButton = () => {
        return <button type={'button'} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
                       onClick={handleSubmit}
        > {"Record EEG To Login"} </button>
    }

    const toAdminButton = () => {
        return <button type={'button'} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
                       onClick={routeToAdmin}
        > {"Go To Admin Page"} </button>
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
            {toAdminButton()}
            {showGraph ? <EEGDataGraph eegData={eegData}/> : <div/>}
        </form>
    );
}