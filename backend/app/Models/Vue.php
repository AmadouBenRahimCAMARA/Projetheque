<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vue extends Model
{
    use HasFactory;

    protected $fillable = [
        'projet_id',
        'utilisateur_id',
    ];

    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }

    public function utilisateur()
    {
        return $this->belongsTo(User::class);
    }
}
