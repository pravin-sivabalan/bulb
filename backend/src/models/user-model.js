let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let UserSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		friends: {
			type: [mongoose.Schema.ObjectId],
			ref: 'User',
			default: [],
		},
		friendRequests: {
			type: [mongoose.Schema.ObjectId],
			ref: 'User',
			default: [],
		},
	},
	{ usePushEach: true }
);

UserSchema.pre('save', function(next) {
	// let user = this;
	bcrypt.hash(this.password, 10, (err, hash) => {
		if (err) return next(err);
		this.password = hash;
		next();
	});
});

UserSchema.methods.generateJWT = function() {
	let expire = new Date();
	expire.setDate(expire.getDate() + 7);
	return jwt.sign(
		{
			id: this._id,
			email: this.email,
			exp: expire.getTime() / 1000,
		},
		process.env.SECRET
	);
};

UserSchema.methods.validatePassword = function(password) {
	if (bcrypt.compareSync(password, this.password)) {
		return true;
	} else {
		return false;
	}
};

UserSchema.methods.updatePassword = function(newPassword) {
	if (bcrypt.compareSync(newPassword, this.password)) {
		return false;
	} else {
		return true;
	}
};

let User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
