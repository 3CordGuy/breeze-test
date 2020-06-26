<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::resource('people', 'PeopleController');

Route::post('groups-import', [
	'as' => 'groups-import',
	'uses' => 'GroupController@import'
]);
Route::resource('groups', 'GroupController');
