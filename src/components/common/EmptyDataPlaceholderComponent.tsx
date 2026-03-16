import { UserIcon } from "lucide-react";

function EmptyDataPlaceholderComponent({type}:{type:string}) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No {type} found</p>
            <p className="text-sm text-gray-400 mt-1">There are no users to display</p>
        </div>
    );
}

export default EmptyDataPlaceholderComponent;
