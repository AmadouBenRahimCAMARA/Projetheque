<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RessourcePedagogique extends Model
{
    use HasFactory;

    protected $table = 'ressources_pedagogiques';

    protected $fillable = [
        'titre',
        'description',
        'type',
        'chemin_fichier',
        'utilisateur_id',
        'filiere_id',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }
}
