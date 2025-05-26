import noTaskImg from "../assets/images/no-task.jpg"
const NoTaskFound = () => {
    return (
        <div className="flex flex-col items-center justify-center ">
            <img
                src={noTaskImg}
                alt="No Tasks"
                className="w-32 mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-700">No Tasks Found</h2>
            <p className="text-gray-500 mt-2">It looks like there are no tasks to display.</p>
        </div>
    );
}

export default NoTaskFound;