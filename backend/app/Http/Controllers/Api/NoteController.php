<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\Projet;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('enseignant')->except(['index', 'show']);
    }

    public function index(Projet $projet)
    {
        $this->authorize('view', $projet);
        return $projet->notes()->with('enseignant')->get();
    }

    public function store(Request $request, Projet $projet)
    {
        $request->validate([
            'note' => 'required|numeric|min:0|max:20',
            'commentaire' => 'nullable|string',
        ]);

        // Vérifier qu'un enseignant ne note pas deux fois le même projet
        $existingNote = Note::where('projet_id', $projet->id)
                              ->where('enseignant_id', auth()->id())
                              ->first();

        if ($existingNote) {
            return response()->json(['message' => 'Vous avez déjà noté ce projet.'], 409);
        }

        $note = $projet->notes()->create([
            'note' => $request->note,
            'commentaire' => $request->commentaire,
            'enseignant_id' => auth()->id(),
        ]);

        return response()->json($note, 201);
    }

    public function show(Note $note)
    {
        $this->authorize('view', $note->projet);
        return $note->load('enseignant');
    }

    public function update(Request $request, Note $note)
    {
        $this->authorize('update', $note);

        $request->validate([
            'note' => 'required|numeric|min:0|max:20',
            'commentaire' => 'nullable|string',
        ]);

        $note->update($request->all());

        return response()->json($note, 200);
    }

    public function destroy(Note $note)
    {
        $this->authorize('delete', $note);
        $note->delete();
        return response()->json(null, 204);
    }
}
