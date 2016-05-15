/**
 * Created by administrator on 4/28/16.
 */
'use strict'

function users(mongoose){
    // Define User Schema
    var userSchema = mongoose.Schema({
        username: { type: String, required:true },
        password: { type: String, required:true },
        createdAt:{ type: Date, default: Date.now, required:true }
    });

    // Define User Model
    var model = mongoose.model('users',userSchema);

    return model;
}

module.exports = users;