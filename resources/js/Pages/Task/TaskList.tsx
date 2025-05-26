import NoTaskFound from "@/components/NoTaskFound";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { format } from "date-fns";
import react from "react";
import EditTask from "./EditTask";

interface Task {
    id: number;
    title: string;
    description: string;
    created_at: string;
}

interface TaskListProps {
    tasks: Task[];
    onDeleted?: () => void;
    onEdit: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDeleted, onEdit }) => {
    const dltTask = (project_id: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        axios
            .delete(`api/tasks/${project_id}`)
            .then(function (response) {
                onDeleted?.();
            })
            .catch(function (error) { });
    };

    return (Array.isArray(tasks) && tasks.length  !== 0) ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
                <Card
                    key={task.id}
                    className="shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 rounded-xl"
                >
                    <CardHeader>
                        <CardTitle className="text-xl">{task.title}</CardTitle>
                        <CardDescription className="text-gray-600 text-sm mt-1">
                            {task.description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="text-sm text-gray-500">
                            <Label className="font-medium text-gray-700">
                                Created Date:{" "}
                                {format(new Date(task.created_at), "dd-MM-yyyy")}
                            </Label>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2">
                        <Button
                            onClick={() => onEdit(task.id)}
                            variant="outline"
                            className="hover:border-blue-500 hover:text-blue-500"
                        >
                            Edit
                        </Button>
                        <Button
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => dltTask(task.id)}
                        >
                            Delete
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    ) : (
        <NoTaskFound />
    );
};

export default TaskList;
