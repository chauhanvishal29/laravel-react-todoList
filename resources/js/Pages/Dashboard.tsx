import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import TaskList from './Task/TaskList';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useEffect, useState } from "react";
import { AddTaskModal } from "./Task/AddTask";

type Projects = {
    id: number;
    name: string;
    project: Array<number>;
};

interface DashboardProps {
    projects: Projects[];
}
export default function Dashboard({ projects }: DashboardProps) {
    const [taskList, setTaskList] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskEdit, setTaskEdit] = useState<number>(Number);
    const [selectedProjectId, setSelectedProjectId] = useState<any | null>(
        null
    );

    const handleEdit = (id: number) => {
        setTaskEdit(id);
        setIsModalOpen(true);
    };
    const projectTaskGet = (project_id: string) => {
        setSelectedProjectId(project_id);
        axios
            .get(`api/tasks/?project_id=${project_id}`)
            .then(function (response) {
                setTaskList(response.data.tasks);
            })
            .catch(function (error) {
                console.log(error.data);
            });
    };
    useEffect(() => {
        projectTaskGet('all');
    }, []);
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="py-12">
                    <div className="flex justify-between mb-5">
                        <Select onValueChange={(e) => projectTaskGet(e)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a Project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">
                                        All Projects
                                    </SelectItem>
                                    {projects.map((project) => {
                                        return (
                                            <SelectItem value={project.id.toString()}>
                                                {project.name}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <AddTaskModal
                            projects={projects}
                            isEditMode={taskEdit}
                            open={isModalOpen}
                            onOpenChange={setIsModalOpen}
                            onTaskAdded={() => {
                                if (selectedProjectId) projectTaskGet(selectedProjectId);
                            }}
                        />
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <TaskList
                                tasks={taskList}
                                onDeleted={() => {
                                    if (selectedProjectId) projectTaskGet(selectedProjectId);
                                }}
                                onEdit={handleEdit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
