import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useEffect, useState } from "react";

type Project = {
    id: number;
    name: string;
};

interface AddTaskModalProps {
    projects: Project[];
    isEditMode: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTaskAdded?: () => void;
}

export function AddTaskModal({ projects, onTaskAdded, isEditMode, onOpenChange, open }: AddTaskModalProps) {
    const [formData, setFormData] = useState({
        projectId: '',
        newProjectTitle: "",
        title: '',
        description: '',
    });
    const [error, setErrors] = useState<Record<string, string[]> | null>(null);
    const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            axios.get(`api/tasks/${isEditMode}`)
                .then((res) => {
                    const task = res.data.task;
                    setFormData({
                        projectId: task.project_id.toString(),
                        title: task.title,
                        newProjectTitle: "",
                        description: task.description,
                    });
                });
        } else {
            resetForm();
        }
    }, [isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProjectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, projectId: value }));
    };

    const resetForm = () => {
        setFormData({
            projectId: '',
            newProjectTitle: "",
            title: '',
            description: '',
        });
    };

    const handleSave = async () => {
        try {
            let projectId = formData.projectId;
            if (isCreatingNewProject && formData.newProjectTitle.trim() !== "") {
                const res = await axios.post("/api/projects", {
                    name: formData.newProjectTitle,
                });
                projectId = res.data.project.id.toString(); // Assuming API response includes project
            }
            if (isEditMode) {
                await axios.put(`/api/tasks/${isEditMode}`, {
                    title: formData.title,
                    description: formData.description,
                    project_id: Number(formData.projectId),
                });
            } else {
                await axios.post("/api/tasks", {
                    title: formData.title,
                    description: formData.description,
                    project_id: Number(formData.projectId),
                });
            }
            if (onTaskAdded) onTaskAdded();
            resetForm();
            onOpenChange(false);
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >

            <DialogTrigger asChild>
                <Button variant="outline">Add Task</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Task</DialogTitle>
                    <DialogDescription>
                        Add a new task to your project. Click save when done.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="project" className="text-right">
                            Project
                        </Label>
                        {isCreatingNewProject ? (
                            <Input
                            className="col-span-3"
                                placeholder="New Project Title"
                                name="newProjectTitle"
                                value={formData.newProjectTitle}
                                onChange={handleChange}
                            />
                        ) : (
                            <Select value={formData.projectId} onValueChange={handleProjectChange}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a Project" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select Project</SelectLabel>
                                        {projects.map((project) => (
                                            <SelectItem key={project.id} value={project.id.toString()}>
                                                {project.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    {/* Toggle New Project */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="" className="text-right"></label>
                        <div
                            className="w-full col-span-3 text-blue-900 font-bold cursor-pointer"
                            onClick={() => setIsCreatingNewProject((prev) => !prev)}
                        >
                            {isCreatingNewProject ? "Select existing project?" : "Make new project?"}
                        </div>
                    </div>

                    {isCreatingNewProject
                        ? error?.name && (
                            <p className="text-sm text-red-500 ml-[100px] -mt-2">
                                {error.name[0]}
                            </p>
                        )
                        : error?.project_id && (
                            <p className="text-sm text-red-500 ml-[100px] -mt-2">
                                {error.project_id[0]}
                            </p>
                        )}
                    {error?.project_id && (
                        <p className="text-sm text-red-500 ml-[100px] -mt-2">
                            {error.project_id[0]}
                        </p>
                    )}

                    {/* Title Input */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            className="col-span-3"
                            onChange={handleChange}
                        />
                    </div>
                    {error?.title && (
                        <p className="text-sm text-red-500 ml-[100px] -mt-2">
                            {error.title[0]}
                        </p>
                    )}

                    {/* Description Textarea */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            className="col-span-3"
                            onChange={handleChange}
                        />
                    </div>
                    {error?.description && (
                        <p className="text-sm text-red-500 ml-[100px] -mt-2">
                            {error.description[0]}
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="secondary" color="secondry" onClick={() => onOpenChange(false)} type="button">
                        Close
                    </Button>
                    <Button onClick={handleSave} type="button">
                        {isEditMode ? 'Update' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
