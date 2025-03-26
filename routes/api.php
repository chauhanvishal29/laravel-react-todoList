<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => '/tasks', 'as' => 'tasks.'], function () {
    Route::get('/', [TaskController::class, 'list']);
});
