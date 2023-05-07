import {useEffect, useState} from "react";
import { loginFields } from "../constants/formFields";
import Input from "./Input";
import {EEGDataGraph} from "./EEGDataGraph";
import {useNavigate} from "react-router-dom";

const fields=loginFields;
let fieldsState = {};
fields.forEach(field=>fieldsState[field.id]='');

export default function Login({emotivManager, eegData}) {
    const [loginState,setLoginState] = useState(fieldsState);
    const [showGraph, setShowGraph] = useState(false);

    const handleChange=(e)=>{
        setLoginState({...loginState,[e.target.id]:e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await authenticateUser();
    }

    //Include login API integration here
    const authenticateUser =  async () => {
        await emotivManager.init();
        await emotivManager.subscribe();
        setTimeout( async () => {
            emotivManager.unsubscribe()
                .then(() => emotivManager.closeSession())
                .then(() => emotivManager.disconnect());

            ModelService.getId(eegData['eeg'])
                .then((res) => console.log('res'));
        }, 61000);
    }

    let navigate = useNavigate();
    const routeToAdmin = () => {
        let path = "/adminpage";
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