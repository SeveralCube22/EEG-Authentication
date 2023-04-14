import {Link} from "react-router-dom";

export default function Header({
    heading,
    paragraph,
    linkName,
    linkUrl = "#"
                               }){
    return (
        <div className="mb-10">
            <div className="flex justify-center">
                <img
                    alt=""
                    className="h-20 w-25 rounded"
                    src="https://us.123rf.com/450wm/tpimovit/tpimovit2110/tpimovit211000084/175612677-brain-wave-3d.jpg?ver=6"/>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {heading}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 mt-5">
                {paragraph} {' '}
                <Link to={linkUrl} className="font-medium text-purple-600 hover:text-purple-500">
                    {linkName}
                </Link>
            </p>
        </div>
    );
}