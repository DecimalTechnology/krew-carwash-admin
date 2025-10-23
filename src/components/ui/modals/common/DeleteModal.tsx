
interface IProps{
  isOpen:boolean;
  handleDelete:any;
  type:string
}
function DeleteModal({isOpen,handleDelete,type}:IProps) {

  if(!isOpen) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50">
        <div className="relative p-4 w-full max-w-md max-h-[90vh] bg-white rounded-lg shadow-md dark:bg-gray-700">
          {/* Close Button */}
          <button
             onClick={()=>handleDelete(false)}
            type="button"
            className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              className="w-3.5 h-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
  
          {/* Modal Content */}
          <div className="p-4 md:p-5 text-center">
            <svg
          
              className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="mb-5 text-lg font-medium text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this {type}?
            </h3>
  
            {/* Confirm Delete Button */}
            <button
              onClick={()=>handleDelete(true)}
              className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 transition-shadow"
            >
              Yes, I'm sure
            </button>
  
            {/* Cancel Button */}
            <button
              onClick={()=>handleDelete(false)}
              className="ml-3 text-sm font-medium text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 hover:shadow-md focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 px-5 py-2.5 rounded-lg transition-shadow"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default DeleteModal;
  