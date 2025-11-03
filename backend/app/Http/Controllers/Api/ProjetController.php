<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Projet;
use App\Models\Telechargement;
use App\Models\Vue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjetController extends Controller
{


    public function index(Request $request)
    {
        $query = Projet::with(['utilisateur', 'filiere'])->withAvg('notes', 'note');

        if ($request->has('filiere')) {
            $query->where('filiere_id', $request->filiere);
        }

        if ($request->has('technologie')) {
            // Suppose que les technologies sont stockées dans la description ou un champ dédié
            $query->where('description', 'like', '%' . $request->technologie . '%');
        }
        
        if ($request->has('auteur')) {
            $query->whereHas('utilisateur', function($q) use ($request) {
                $q->where('nom', 'like', '%' . $request->auteur . '%');
            });
        }

        if ($request->has('annee_academique')) {
            $query->where('annee_academique', $request->annee_academique);
        }

        if ($request->has('sort_by_note') && $request->sort_by_note === 'desc') {
            $query->orderByDesc('notes_avg_note');
        } elseif ($request->has('sort_by_note') && $request->sort_by_note === 'asc') {
            $query->orderBy('notes_avg_note');
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'annee_academique' => 'required|string|max:255',
            'filiere_id' => 'required|exists:filieres,id',
            'lien_github' => 'nullable|url',
'presentation' => 'nullable|file|mimes:pdf,ppt,pptx|max:20480', // 20 Mo Max
        ]);

        $fichiers = [];
        if ($request->hasFile('rapport')) {
            $fichiers['rapport'] = $request->file('rapport')->store('rapports', 'public');
        }
        if ($request->hasFile('code_source')) {
            $fichiers['code_source'] = $request->file('code_source')->store('codes', 'public');
        }
        if ($request->hasFile('presentation')) {
            $fichiers['presentation'] = $request->file('presentation')->store('presentations', 'public');
        }

        $projet = Projet::create([
            'titre' => $validatedData['titre'],
            'description' => $validatedData['description'],
            'annee_academique' => $validatedData['annee_academique'],
            'filiere_id' => $validatedData['filiere_id'],
            'lien_github' => $validatedData['lien_github'] ?? null,
            'utilisateur_id' => auth()->id(),
            'fichiers' => $fichiers,
        ]);

        return response()->json($projet, 201);
    }

    public function show(Projet $projet)
    {
        // Enregistrer une vue
        $userId = auth()->id();
        if ($userId) {
            Vue::firstOrCreate([
                'projet_id' => $projet->id,
                'utilisateur_id' => $userId,
            ]);
        } else {
            // Optionnel: enregistrer les vues anonymes si nécessaire
            // Vue::create(['projet_id' => $projet->id]);
        }

        return $projet->load(['utilisateur', 'filiere', 'notes.enseignant', 'commentaires.utilisateur']);
    }

    public function update(Request $request, Projet $projet)
    {
        $this->authorize('update', $projet);

        $validatedData = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'annee_academique' => 'required|string|max:255',
            'filiere_id' => 'required|exists:filieres,id',
            'lien_github' => 'nullable|url',
            'rapport' => 'nullable|file|mimes:pdf|max:10240', // 10 Mo Max
            'code_source' => 'nullable|file|mimes:zip|max:51200', // 50 Mo Max
            'presentation' => 'nullable|file|mimes:pdf,ppt,pptx|max:20480', // 20 Mo Max
        ]);

        $fichiers = $projet->fichiers ?? [];

        // Gérer le fichier de rapport
        if ($request->hasFile('rapport')) {
            if (isset($fichiers['rapport'])) {
                Storage::disk('public')->delete($fichiers['rapport']);
            }
            $fichiers['rapport'] = $request->file('rapport')->store('rapports', 'public');
        } elseif ($request->input('clear_rapport')) {
            if (isset($fichiers['rapport'])) {
                Storage::disk('public')->delete($fichiers['rapport']);
                unset($fichiers['rapport']);
            }
        }

        // Gérer le fichier de code source
        if ($request->hasFile('code_source')) {
            if (isset($fichiers['code_source'])) {
                Storage::disk('public')->delete($fichiers['code_source']);
            }
            $fichiers['code_source'] = $request->file('code_source')->store('codes', 'public');
        } elseif ($request->input('clear_code_source')) {
            if (isset($fichiers['code_source'])) {
                Storage::disk('public')->delete($fichiers['code_source']);
                unset($fichiers['code_source']);
            }
        }

        // Gérer le fichier de présentation
        if ($request->hasFile('presentation')) {
            if (isset($fichiers['presentation'])) {
                Storage::disk('public')->delete($fichiers['presentation']);
            }
            $fichiers['presentation'] = $request->file('presentation')->store('presentations', 'public');
        } elseif ($request->input('clear_presentation')) {
            if (isset($fichiers['presentation'])) {
                Storage::disk('public')->delete($fichiers['presentation']);
                unset($fichiers['presentation']);
            }
        }

        $projet->update([
            'titre' => $validatedData['titre'],
            'description' => $validatedData['description'],
            'annee_academique' => $validatedData['annee_academique'],
            'filiere_id' => $validatedData['filiere_id'],
            'lien_github' => $validatedData['lien_github'] ?? null,
            'fichiers' => $fichiers,
        ]);

        return response()->json($projet, 200);
    }

    public function download(Projet $projet, $type_fichier)
    {
        if (!isset($projet->fichiers[$type_fichier])) {
            return response()->json(['message' => 'Fichier non trouvé.'], 404);
        }

        $filePath = $projet->fichiers[$type_fichier];

        if (!Storage::disk('public')->exists($filePath)) {
            return response()->json(['message' => 'Fichier non trouvé sur le serveur.'], 404);
        }

        // Enregistrer le téléchargement
        Telechargement::create([
            'projet_id' => $projet->id,
            'utilisateur_id' => auth()->id(), // Peut être null si non authentifié
            'type_fichier' => $type_fichier,
        ]);

        return Storage::disk('public')->download($filePath);
    }

    public function destroy(Projet $projet)
    {
        $this->authorize('delete', $projet);

        // Supprimer les fichiers associés
        foreach ($projet->fichiers as $type => $path) {
            Storage::disk('public')->delete($path);
        }

        $projet->delete();

        return response()->json(null, 204);
    }
}
