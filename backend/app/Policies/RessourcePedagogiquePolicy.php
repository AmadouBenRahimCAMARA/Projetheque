<?php

namespace App\Policies;

use App\Models\RessourcePedagogique;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RessourcePedagogiquePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, RessourcePedagogique $ressourcePedagogique): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, RessourcePedagogique $ressourcePedagogique): bool
    {
        return $user->id == $ressourcePedagogique->utilisateur_id || $user->role === 'administrateur';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, RessourcePedagogique $ressourcePedagogique): bool
    {
        return $user->id == $ressourcePedagogique->utilisateur_id || $user->role === 'administrateur';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, RessourcePedagogique $ressourcePedagogique): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, RessourcePedagogique $ressourcePedagogique): bool
    {
        return false;
    }
}
