<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Person;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PeopleControllerTest extends TestCase
{
    use WithFaker;

    public function testPersonCreated()
    {
        $expected = [
            'first_name' => 'Sally',
            'last_name' => 'Ride',
            'email_address' => 'sallyride@nasa.gov',
            'status' => 'archived'
        ];
        $response = $this->json('POST', '/api/people', $expected);
        $response
            ->assertStatus(201)
            ->assertJsonFragment($expected);
    }

    public function testPersonRetrieved()
    {
        $person = factory('App\Models\Person')->create();

        $response = $this->json('GET', '/api/people/' . $person->id);
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'first_name',
                    'last_name',
                    'email_address',
                    'status',
                    'created_at',
                    'updated_at'
                ]
            ]);
    }

    public function testAllPeopleRetrieved()
    {
        factory('App\Models\Person', 5)->create();

        $count = Person::all()->where('status', '=', 'active')->count();

        $response = $this->json('GET', '/api/people');
        $response
            ->assertStatus(200)
            ->assertJsonCount($count, 'data');
    }

    public function testNoPersonRetrieved()
    {
        $person = factory('App\Models\Person')->create();
        Person::destroy($person->id);

        $response = $this->json('GET', '/api/people/' . $person->id);
        $response->assertStatus(404);
    }

    public function testPersonUpdated()
    {
        $person = factory('App\Models\Person')->create();

        $updatedFirstName = $this->faker->firstName();
        $response = $this->json('PUT', '/api/people/' . $person->id, [
            'first_name' => $updatedFirstName
        ]);
        $response->assertStatus(204);

        $updatedPerson = Person::find($person->id);
        $this->assertEquals($updatedFirstName, $updatedPerson->first_name);
    }

    public function testPersonDeleted()
    {
        $person = factory('App\Models\Person')->create();

        $deleteResponse = $this->json('DELETE', '/api/people/' . $person->id);
        $deleteResponse->assertStatus(204);

        $response = $this->json('GET', '/api/people/' . $person->id);
        $response->assertStatus(404);
    }
}
