<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index()
    {
        return AcademicYear::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'year' => 'required|string|unique:academic_years,year|max:255',
        ]);

        $academicYear = AcademicYear::create($request->all());
        return response()->json($academicYear, 201);
    }

    public function show(AcademicYear $academicYear)
    {
        return $academicYear;
    }

    public function update(Request $request, AcademicYear $academicYear)
    {
        $request->validate([
            'year' => 'required|string|unique:academic_years,year,' . $academicYear->id . '|max:255',
        ]);

        $academicYear->update($request->all());
        return response()->json($academicYear, 200);
    }

    public function destroy(AcademicYear $academicYear)
    {
        $academicYear->delete();
        return response()->json(null, 204);
    }
}
