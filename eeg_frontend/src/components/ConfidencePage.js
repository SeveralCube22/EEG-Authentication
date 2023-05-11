import {useLocation} from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import {useEffect} from "react";

export default function ConfidencePage () {

    const {state} = useLocation(); //get server response data from the prior "UploadPage" component


    useEffect(() => {
        if(state != null) {
            responseBox().setState({text: state["data"]})
        }
    }, []);


    const responseBox = () => {
        return <b type={'text'} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 mt-10">
            {"response"} </b>

    }

    const ProgressBar = () => {
        return (
            <div style={{ width: '150px', height: '150px', paddingTop: '30px', marginLeft: '150px'}}>
                <CircularProgressbar
                    value={50}
                    text={`${50}%`}
                    styles={{
                        path: {
                            stroke: 'purple'
                        },
                        text: {
                            fill: 'purple',
                            fontSize: '20px'
                        }
                    }}
                />
            </div>
        );
    }


    return(
        <div className="mt-8 space-y-6">
            <div className="-space-y-px">
                {responseBox()}
                {ProgressBar()}
            </div>

        </div>
    );
}