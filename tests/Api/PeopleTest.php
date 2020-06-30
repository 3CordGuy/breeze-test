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

    public function testPeopleImport()
    {
        $peopleData = [
            [
                "id" => 14,
                "first_name" => "Leslie",
                "last_name" => "Knope",
                "email_address" => "leslie@pawnee.in.gov",
                "status" => "active"
            ],
            [
                "id" => 2,
                "first_name" => "Jerry",
                "last_name" => "Gergich",
                "email_address" => "garry@pawnee.in.gov",
                "status" => "active"
            ],
        ];

        $deleteResponse = $this->json('POST', '/api/people-import/', $peopleData);
        $deleteResponse->assertStatus(204);

        $response = $this->json('GET', '/api/people/');
        $response
            ->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function testPeopleImportCanUpdate()
    {
        // Initial insert nature of the endpoint
        $peopleData1 = [
            [
                "id" => 14,
                "first_name" => "Leslie",
                "last_name" => "Knope",
                "email_address" => "leslie@pawnee.in.gov",
                "status" => "active"
            ],
            [
                "id" => 2,
                "first_name" => "Jerry",
                "last_name" => "Gergich",
                "email_address" => "garry@pawnee.in.gov",
                "status" => "active"
            ]
        ];

        $importResponse = $this->json('POST', '/api/people-import/', $peopleData1);
        $importResponse->assertStatus(204);

        // We will change Jerry to Larry and test the upsert nature of the endpoint
        $peopleData2 = [
            [
                "id" => 16,
                "first_name" => "Andy",
                "last_name" => "Dwyer",
                "email_address" => "andy@johnnykarate.com",
                "status" => "active"
            ],
            [
                "id" => 2,
                "first_name" => "Larry",
                "last_name" => "Gergich",
                "email_address" => "garry@pawnee.in.gov",
                "status" => "active"
            ]
        ];


        $importResponse = $this->json('POST', '/api/people-import/', $peopleData2);
        $importResponse->assertStatus(204);

        $updatedPerson = Person::find(2);
        $this->assertEquals("Larry", $updatedPerson->first_name);
    }
}
