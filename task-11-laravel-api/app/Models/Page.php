<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Page extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'status',
    ];

    public function contentBlocks(): HasMany
    {
        return $this->hasMany(ContentBlock::class)
            ->orderBy('position');
    }
}
