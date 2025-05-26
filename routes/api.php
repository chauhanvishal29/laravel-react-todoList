<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth')->group(function () {
  // Tasks API
  Route::group(['prefix' => '/tasks', 'as' => 'tasks.'], function () {
    Route::get('/', [TaskController::class, 'list']);
    Route::get('/{id}', [TaskController::class, 'get'])
      ->where('id', '[1-9][0-9]*');
    Route::post('/', [TaskController::class, 'store']);
    Route::put('/{id}', [TaskController::class, 'update'])
      ->where('id', '[1-9][0-9]*');
    Route::delete('/{id}', [TaskController::class, 'delete'])
      ->where('id', '[1-9][0-9]*');
    Route::put('/', [TaskController::class, 'reorder']);
  });

  // Projects API
  Route::group(['prefix' => '/projects', 'as' => 'projects.'], function () {
    Route::get('/', [ProjectController::class, 'list']);
  });
});
