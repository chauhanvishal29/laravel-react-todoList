<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    protected ?ProjectService $projectService = null;
    public function __construct(ProjectService $projectService) {
        $this->projectService = $projectService;
    }
    public function list() : JsonResponse {
        $data = $this->projectService->getAll();
        return response()->json([
            "success" => true,
            "projects" => $data,
            "code" => 200,
        ]);
    }
    /**
     * Display a listing of the resource.
     */
    public function index(): void
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): void
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): void
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project): void
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project): void
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project): void
    {
        //
    }
}
