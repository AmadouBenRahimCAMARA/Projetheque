<?php

use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentaireController;
use App\Http\Controllers\Api\FiliereController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\ProjetController;
use App\Http\Controllers\Api\RessourcePedagogiqueController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentification
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Téléchargement de fichiers de projet (accessible sans authentification)
Route::get('/projets/{projet}/download/{type_fichier}', [ProjetController::class, 'download']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Projets
    Route::apiResource('projets', ProjetController::class);

    // Ressources Pédagogiques
    Route::apiResource('ressources-pedagogiques', RessourcePedagogiqueController::class);
    Route::get('/ressources-pedagogiques/{ressource}/download', [RessourcePedagogiqueController::class, 'download']);

    // Filieres (protégé par le middleware admin pour CUD)
    Route::apiResource('filieres', FiliereController::class);

    // Notes (protégé par le middleware enseignant pour CUD)
    Route::apiResource('projets.notes', NoteController::class)->shallow();

    // Commentaires
    Route::apiResource('projets.commentaires', CommentaireController::class)->shallow();

    // Admin User Management
    Route::middleware('admin')->group(function () {
        Route::get('/admin/users', [AdminUserController::class, 'index']);
        Route::put('/admin/users/{user}/role', [AdminUserController::class, 'updateRole']);
        Route::get('/admin/statistics', [AdminUserController::class, 'getStatistics']);
    });
});
