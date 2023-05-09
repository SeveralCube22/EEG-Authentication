import Header from "./components/Header.js";
import UploadPage from "./components/UploadPage";

export default function AdminUpload() {
    return(
        <>
            <Header
                heading= "Admin Console"
                paragraph= "Upload data here."
                linkName= ""
                linkUrl = ""
            />
            <UploadPage/>
        </>
    );
}