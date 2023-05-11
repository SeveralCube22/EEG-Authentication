import ModelService from "../services/ModelService";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function UploadPage () {
    let [dataFile, setDataFile] = useState(null);

    const handleFileChange = e => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            setDataFile(e.target.result);
        };
    };

    const navigate = useNavigate();


    const uploadDataFile = async (e) => {
        if(dataFile) {
            let data = JSON.parse(dataFile); // DataFile will be in form {data: [[...]]} only sending the list as server will append {data: ...} anyways
            let response = await ModelService.getIdFromAdmin(data["data"]);
            console.log(response['data']);
            navigate('/confidence', {state: response}) //navigate to new page and send retrieved data to it

            //alert(response['data']);
        }
    }

    const uploadButton = () => {
        return <button type={'button'} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
                       onClick={uploadDataFile}
        > {"Upload Data"} </button>
    }

    return(
        <div className="mt-8 space-y-6">
            <div className="-space-y-px">
                <input type="file" onChange={handleFileChange} />
                {uploadButton()}
            </div>

        </div>
    );
}