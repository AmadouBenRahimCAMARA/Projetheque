<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RessourcePedagogique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RessourcePedagogiqueController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $query = RessourcePedagogique::with(['utilisateur', 'filiere']);

        if ($request->has('filiere')) {
            $query->where('filiere_id', $request->filiere);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return $query->latest()->get();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:cours,exercice,sujet_examen',
            'filiere_id' => 'required|exists:filieres,id',
            'fichier' => 'required|file|mimes:pdf|max:20480', // 20MB Max
        ]);

        $path = $request->file('fichier')->store('ressources_pedagogiques', 'public');

        $ressource = RessourcePedagogique::create([
            'titre' => $validatedData['titre'],
            'description' => $validatedData['description'],
            'type' => $validatedData['type'],
            'filiere_id' => $validatedData['filiere_id'],
            'chemin_fichier' => $path,
            'utilisateur_id' => auth()->id(),
        ]);

        return response()->json($ressource->load('utilisateur', 'filiere'), 201);
    }

    public function show(RessourcePedagogique $ressources_pedagogique)
    {
        return $ressources_pedagogique->load(['utilisateur', 'filiere']);
    }

    public function update(Request $request, RessourcePedagogique $ressources_pedagogique)
    {
        $this->authorize('update', $ressources_pedagogique);

        $validatedData = $request->validate([
            'titre' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'type' => 'sometimes|required|in:cours,exercice,sujet_examen',
            'filiere_id' => 'sometimes|required|exists:filieres,id',
        ]);

        $ressources_pedagogique->update($validatedData);

        return response()->json($ressources_pedagogique->load('utilisateur', 'filiere'), 200);
    }

    public function destroy(RessourcePedagogique $ressources_pedagogique)
    {
        $this->authorize('delete', $ressources_pedagogique);

        Storage::disk('public')->delete($ressources_pedagogique->chemin_fichier);

        $ressources_pedagogique->delete();

        return response()->json(null, 204);
    }

    public function download(RessourcePedagogique $ressources_pedagogique)
    {
        if (!Storage::disk('public')->exists($ressources_pedagogique->chemin_fichier)) {
            return response()->json(['message' => 'Fichier non trouvé sur le serveur.'], 404);
        }

        return Storage::disk('public')->download($ressources_pedagogique->chemin_fichier);
    }
}