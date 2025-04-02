export default function Loading(){
    return (
        <div className="flex h-screen items-center justify-center">
            <svg
                className="animate-spin h-10 w-10 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    strokeWidth="4"
                    stroke="currentColor"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12zm2.5-1.5h11a2.5 2.5 0 1 1 0 5h-11a2.5 2.5 0 1 1 0-5z"
                />
            </svg>
        </div>
    );
}