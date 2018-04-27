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
		followers: {
			type: [mongoose.Schema.ObjectId],
			ref: 'User',
			default: [],
		},
		following: {
			type: [mongoose.Schema.ObjectId],
			ref: 'User',
			default: [],
		},
		likes: {
			type: [mongoose.Schema.ObjectId],
			ref: 'Idea',
			default: []
		}
	},
	{ usePushEach: true }
);

UserSchema.pre('save', function(next) {
	if(this.password && this.isModified('password')) {
		this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(1));
	}
	next();
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
	return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.updatePassword = function(newPassword) {
	// return bcrypt.compareSync(password, this.password);
	this.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(1));
	return this.password;
};

let User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
