<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Filiere;
use Illuminate\Http\Request;

class FiliereController extends Controller
{


    public function index()
    {
        return Filiere::all();
    }

    public function store(Request $request)
    {
        $request->validate(['nom' => 'required|string|unique:filieres|max:255']);
        $filiere = Filiere::create($request->all());
        return response()->json($filiere, 201);
    }

    public function show(Filiere $filiere)
    {
        return $filiere;
    }

    public function update(Request $request, Filiere $filiere)
    {
        $request->validate(['nom' => 'required|string|unique:filieres,nom,'.$filiere->id.'|max:255']);
        $filiere->update($request->all());
        return response()->json($filiere, 200);
    }

    public function destroy(Filiere $filiere)
    {
        $filiere->delete();
        return response()->json(null, 204);
    }
}
