import Header from "./components/Header";
import HomePage from "./components/HomePage";

export default function Home () {
    return (
        <>
            <Header
                heading= "Home"
                paragraph= ""
                linkName= "Github Repo"
                linkUrl = "https://github.com/SeveralCube22/EEG-Authentication"
            />
            <HomePage/>
        </>
    );
}