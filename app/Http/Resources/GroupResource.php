<?php

namespace App\Http\Resources;

use App\Http\Resources\PersonResource;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,
            'members'       => PersonResource::collection($this->members)->where('status', '=', 'active')->toArray()
        ];
    }
}
