<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    protected $fillable = [
        'group_id',
        'first_name',
        'last_name',
        'email_address',
        'status'
    ];
}
