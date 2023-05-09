import {useEffect} from "react";
import AuthService from "../services/AuthService";


export default function HomePage () {

    useEffect(() => {
        const fetchUserData = async () => {
            let userData = await AuthService.getUserInfo()
            return userData
        }
        fetchUserData().then((response) => userNameBox().setState({text: response["name"]})
        )
    }, []);
    const userNameBox = () => {
        return <b type={'text'} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 mt-10">
            {"Username"} </b>

    }

    return(
        <div className="mt-8 space-y-6">
            <div className="-space-y-px">
                {userNameBox()}
            </div>

        </div>
    );
}