<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveGroupIdConstraint extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('people', function (Blueprint $table) {
            $table->dropForeign('people_group_id_foreign')->references('id')->on('people');
            $table->foreign('group_id')->references('id')->on('groups');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::table('people', function (Blueprint $table) {
            $table->dropForeign('people_group_id_foreign')->references('id')->on('groups');
            $table->foreign('group_id')->references('id')->on('people');
        });
    }
}
