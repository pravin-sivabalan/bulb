let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

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
    bcrypt.hash(this.password, 10, (err, hash) => {
        if(err) return next(err);
        this.password = hash;
        next();
    });
});

UserSchema.methods.validatePassword = function(password) {
    if(bcrypt.compareSync(password, this.password)) {
        return true;
    } else {
        return false;
    }
}

let User = module.exports = mongoose.model('User', UserSchema, 'user');
