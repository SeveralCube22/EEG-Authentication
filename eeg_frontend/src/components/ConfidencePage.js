import {useLocation} from "react-router-dom";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import {useEffect, useState} from "react";
import {easeQuadInOut} from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";

export default function ConfidencePage () {
    let location = useLocation(); //get server response data from the prior "UploadPage" component

    let [modelReturnData, setModelReturnData] = useState(location.state && "response" in location.state ? location.state.response : null);

    useEffect(() => {
        console.log(location.state);
        if(location.state && "response" in location.state) {
            let value = location.state.response;
            setModelReturnData(value);
            window.history.replaceState(null, document.title);
        }
    }, []);

    const responseBox = () => {
        return <b type={'text'} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 mt-10">
            {modelReturnData ? `${modelReturnData["user"]}`: "User Not Found!"} </b>

    }

    const ProgressBar = () => {
        return (
            <div style={{ width: '150px', height: '150px', paddingTop: '30px', marginLeft: '150px'}}>
                <AnimatedProgressProvider
                    valueStart={0}
                    valueEnd={modelReturnData ? modelReturnData['confidence'] : 0}
                    duration={1.4}
                    easingFunction={easeQuadInOut}
                >
                    {value => {
                        const roundedValue = Math.round(value);
                        return (
                            <CircularProgressbar
                                value={value}
                                text={`${roundedValue}%`}
                                styles={buildStyles({ pathTransition: "none", textColor: 'purple', pathColor: 'purple', textSize: '20px' })}
                            />
                        );
                    }}
                </AnimatedProgressProvider>
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