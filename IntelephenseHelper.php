<?php

/**
 * This file is to provide type information for Intelephense.
 */

namespace Illuminate\Contracts\Auth;

interface Guard
{
    /**
     * Get the currently authenticated user.
     *
     * @return \App\Models\User|null
     */
    public function user();

    /**
     * Get the ID for the currently authenticated user.
     *
     * @return int|string|null
     */
    public function id();

    /** 
     * Determine if the current user is authenticated.
     * @return bool
     */
    public function check(): bool;
}

interface StatefulGuard
{
    /**
     * Get the currently authenticated user.
     *
     * @return \App\Models\User|null
     */
    public function user();

    /**
     * Get the ID for the currently authenticated user.
     *
     * @return int|string|null
     */
    public function id();

    /** 
     * Determine if the current user is authenticated.
     * @return bool
     */
    public function check(): bool;
}

interface Factory
{
    /**
     * Get the currently authenticated user.
     *
     * @return \App\Models\User|null
     */
    public function user();

    /**
     * Get the ID for the currently authenticated user.
     *
     * @return int|string|null
     */
    public function id();

    /** 
     * Determine if the current user is authenticated.
     * @return bool
     */
    public function check(): bool;
}

