<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Projet;
use App\Models\Note;
use App\Models\Vue;
use App\Models\Telechargement;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin');
    }

    public function index()
    {
        return User::all();
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:etudiant,enseignant,administrateur',
        ]);

        $user->role = $request->role;
        $user->save();

        return response()->json($user);
    }

    public function getStatistics()
    {
        $totalProjets = Projet::count();
        $totalUtilisateurs = User::count();
        $totalEtudiants = User::where('role', 'etudiant')->count();
        $totalEnseignants = User::where('role', 'enseignant')->count();
        $totalAdmins = User::where('role', 'administrateur')->count();
        $moyenneNotes = Note::avg('note');
        $totalVues = Vue::count();
        $totalTelechargements = Telechargement::count();

        return response()->json([
            'total_projets' => $totalProjets,
            'total_utilisateurs' => $totalUtilisateurs,
            'total_etudiants' => $totalEtudiants,
            'total_enseignants' => $totalEnseignants,
            'total_admins' => $totalAdmins,
            'moyenne_notes' => round($moyenneNotes, 2),
            'total_vues' => $totalVues,
            'total_telechargements' => $totalTelechargements,
        ]);
    }
}
