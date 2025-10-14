<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Projet extends Model
{
    use HasFactory;

    protected $table = 'projets';

    protected $fillable = [
        'titre',
        'description',
        'annee_academique',
        'fichiers',
        'lien_github',
        'utilisateur_id',
        'filiere_id',
    ];

    protected $casts = [
        'fichiers' => 'array',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class, 'filiere_id');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'projet_id');
    }

    public function commentaires()
    {
        return $this->hasMany(Commentaire::class, 'projet_id');
    }
}
