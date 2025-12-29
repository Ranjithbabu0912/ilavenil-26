const Unauthorized = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-red-600">403</h1>
            <p className="mt-2">You do not have permission to access this page.</p>
        </div>
    );
};

export default Unauthorized;
