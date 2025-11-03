<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RessourcePedagogique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RessourcePedagogiqueController extends Controller
{


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
            'fichier' => 'required|file|mimes:pdf|max:20480', // 20 Mo Max
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

    public function show(RessourcePedagogique $ressourcePedagogique)
    {
        return $ressourcePedagogique->load(['utilisateur', 'filiere']);
    }

    public function update(Request $request, RessourcePedagogique $ressourcePedagogique)
    {
        $this->authorize('update', $ressourcePedagogique);

        $validatedData = $request->validate([
            'titre' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'type' => 'sometimes|required|in:cours,exercice,sujet_examen',
            'filiere_id' => 'sometimes|required|exists:filieres,id',
            'fichier' => 'nullable|file|mimes:pdf|max:20480', // 20 Mo Max
        ]);

        if ($request->hasFile('fichier')) {
            // Supprimer l'ancien fichier
            if ($ressourcePedagogique->chemin_fichier) {
                Storage::disk('public')->delete($ressourcePedagogique->chemin_fichier);
            }
            // Stocker le nouveau fichier
            $validatedData['chemin_fichier'] = $request->file('fichier')->store('ressources_pedagogiques', 'public');
        }

        $ressourcePedagogique->update($validatedData);

        return response()->json($ressourcePedagogique->load('utilisateur', 'filiere'), 200);
    }

    public function destroy($id)
    {
        $ressourcePedagogique = RessourcePedagogique::findOrFail($id);

        $this->authorize('delete', $ressourcePedagogique);

        // Vérifier si un chemin de fichier existe avant de tenter de supprimer
        if ($ressourcePedagogique->chemin_fichier) {
            Storage::disk('public')->delete($ressourcePedagogique->chemin_fichier);
        }

        $ressourcePedagogique->delete();

        return response()->json(null, 204);
    }

    public function download(RessourcePedagogique $ressource)
    {
        if (!Storage::disk('public')->exists($ressource->chemin_fichier)) {
            return response()->json(['message' => 'Fichier non trouvé sur le serveur.'], 404);
        }

        return Storage::disk('public')->download($ressource->chemin_fichier);
    }
}