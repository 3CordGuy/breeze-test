<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class GroupControllerTest extends TestCase
{
    use WithFaker;

    public function testGroupCreated()
    {
        $expected = [
            'name' => 'Volunteers'
        ];
        $response = $this->json('POST', '/api/group', $expected);
        $response
            ->assertStatus(201)
            ->assertJsonFragment($expected);

    }
}
