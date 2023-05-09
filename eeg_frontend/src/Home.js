import Header from "./components/Header";
import HomePage from "./components/HomePage";

export default function Home () {
    return (
        <>
            <Header
                heading= "Home"
                paragraph= ""
                linkName= ""
                linkUrl = ""
                imgUrl = "https://www.rawshorts.com/freeicons/wp-content/uploads/2017/01/blue_repicthousebase_1484336386-1.png"
            />
            <HomePage/>
        </>
    );
}