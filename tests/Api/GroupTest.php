<?php

namespace Tests\Feature;

use App\Models\Group;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class GroupControllerTest extends TestCase
{
    use WithFaker;

    public function testAllGroupsRetrieved()
    {
        factory('App\Models\Group', 10)->create();

        $response = $this->json('GET', '/api/groups');
        $response
            ->assertStatus(200)
            ->assertJsonCount(10, 'data');
    }

    public function testNoGroupRetrieved()
    {
        $group = factory('App\Models\Group')->create();
        Group::destroy($group->id);

        $response = $this->json('GET', '/api/groups/' . $group->id);
        $response->assertStatus(404);
    }

    public function testGroupCreated()
    {
        $expected = [
            'name' => 'Volunteers'
        ];
        $response = $this->json('POST', '/api/groups', $expected);
        $response
            ->assertStatus(201)
            ->assertJsonFragment($expected);
    }

    public function testGroupRetrieved()
    {
        $group = factory('App\Models\Group')->create();

        $response = $this->json('GET', '/api/groups/' . $group->id);
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'name',
                    'created_at',
                    'updated_at'
                ]
            ]);
    }

    public function testGroupUpdated()
    {
        $group = factory('App\Models\Group')->create();
        
        $updatedName = $this->faker->name();
        $response = $this->json('PUT', '/api/groups/' . $group->id, [
            'name' => $updatedName
        ]);
        $response->assertStatus(204);

        $updatedGroup = Group::find($group->id);
        $this->assertEquals($updatedName, $updatedGroup->name);
    }

    public function testGroupDeleted()
    {
        $group = factory('App\Models\Group')->create();

        $deleteResponse = $this->json('DELETE', '/api/groups/' . $group->id);
        $deleteResponse->assertStatus(204);

        $response = $this->json('GET', '/api/groups/' . $group->id);
        $response->assertStatus(404);

    }
}
