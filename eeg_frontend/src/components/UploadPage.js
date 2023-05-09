export default function UploadPage () {
    const uploadButton = () => {
        return <button type={'button'} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
                       onClick={console.log("hello")}
        > {"Upload Data"} </button>
    }

    return(
        <div className="mt-8 space-y-6">
            <div className="-space-y-px">
                {uploadButton()}
            </div>

        </div>
    );
}