import { Combobox } from "@/components/ui/Combobox";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Link } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";
import TaskList from "./Task/TaskList";
import { AddTaskModal } from "./Task/AddTask";

type Projects = {
    id: number;
    name: string;
    project: Array<number>;
};

interface HomeProps {
    projects: Projects[];
    name?: string;
}

export default function Home({ projects, name }: HomeProps) {
    const [taskList, setTaskList] = useState<any[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
        null
    );
    const projectTaskGet = (project_id: number) => {
        setSelectedProjectId(project_id);
        axios
            .get(`api/tasks/?project_id=${project_id}`)
            .then(function (response) {
                setTaskList(response.data.tasks);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <div className="p-6 text-center">
            <h1 className="text-2xl font-bold text-9xl text-yellow-300">
                Task List
            </h1>
            <div className="flex justify-between">
                <Select onValueChange={(e) => projectTaskGet(e)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Project" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Select Project</SelectLabel>
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

                <AddTaskModal projects={projects} />
            </div>

            {/* Listing task list component  */}
            <TaskList
                tasks={taskList}
                onDeleted={() => {
                    if (selectedProjectId) projectTaskGet(selectedProjectId);
                }}
            />
        </div>
    );
}
