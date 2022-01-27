<?php

use App\Models\Link;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return "OK";
});

Route::post('/link', function (Request $request) {
    $url = $request->input('url');

    $token = Str::random(20);

    Link::create(compact("token", "url"));

    return [
        "status" => "success",
        "code" => 200,
        "data" => [
            "token" => $token,
            "url" => "http://localhost:4040/link/$token"
        ]
    ];
});


Route::get('/link/{link:token}', function (Link $link) {
    return $link->url;
});
