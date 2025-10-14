<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commentaire;
use App\Models\Projet;
use Illuminate\Http\Request;

class CommentaireController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Projet $projet)
    {
        return $projet->commentaires()->with('utilisateur')->get();
    }

    public function store(Request $request, Projet $projet)
    {
        $request->validate(['contenu' => 'required|string']);

        $commentaire = $projet->commentaires()->create([
            'contenu' => $request->contenu,
            'utilisateur_id' => auth()->id(),
        ]);

        return response()->json($commentaire->load('utilisateur'), 201);
    }

    public function show(Commentaire $commentaire)
    {
        return $commentaire->load('utilisateur');
    }

    public function update(Request $request, Commentaire $commentaire)
    {
        $this->authorize('update', $commentaire);

        $request->validate(['contenu' => 'required|string']);

        $commentaire->update($request->all());

        return response()->json($commentaire->load('utilisateur'), 200);
    }

    public function destroy(Commentaire $commentaire)
    {
        $this->authorize('delete', $commentaire);
        $commentaire->delete();
        return response()->json(null, 204);
    }
}
