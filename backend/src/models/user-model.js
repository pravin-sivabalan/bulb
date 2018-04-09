import { Schema as _Schema, model } from "mongoose";
import { hash as _hash, compareSync } from "bcrypt";
let Schema = _Schema;

let UserSchema = new Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
});

UserSchema.pre('save', function(next) {
    let user = this;
    _hash(this.password, 10, (err, hash) => {
        if(err) return next(err);
        this.password = hash;
        next();
    });
});

UserSchema.methods.validatePassword = function(password) {
    if(compareSync(password, this.password)) {
        return true;
    } else {
        return false;
    }
}

const User = model('User', UserSchema, 'users');

export default {
    User
};
