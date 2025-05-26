import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useState } from "react";

const EditTask = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        projectId: '',
        title: '',
        description: '',
    });
    let [isOpen, setIsOpen] = useState(false)
    const [error, setErrors] = useState<Record<string, string[]> | null>(null);
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
            title: '',
            description: '',
        });
    };

    const addTask = async () => {
        try {
            await axios.post("/api/tasks", {
                title: formData.title,
                description: formData.description,
                project_id: Number(formData.projectId),
            });

            // if (onTaskAdded) onTaskAdded();
            resetForm();
            setIsOpen(false);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        }
    };

    function getProjectlist() {
        axios.get('api/projects')
            .then(function (response) {
                setProjects(response.data.projects);
            }).catch(function (error) {
                console.log(error);
            })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
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
                    {/* Project Select */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="project" className="text-right">
                            Project
                        </Label>
                        <Select value={formData.projectId} onValueChange={handleProjectChange}>
                            <SelectTrigger className="w-[180px]">
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
                    </div>
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
                    <Button variant="secondary" color="secondry" onClick={(e) => setIsOpen(false)} type="button">
                        Close
                    </Button>
                    <Button onClick={addTask} type="button">
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default EditTask;