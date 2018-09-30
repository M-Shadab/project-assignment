const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Schema For Customer
const CustomerSchema = new Schema({
	Email:{
		type: String,
		required: true
	},
	SubscriptionType:{
		type: String,
		required: true
	},
	SubscriptionDuration:{
		type: Number,
		required: true
	},
	SubscriptionStartDate:{
		type: String,
		required: true
	},
	SubscriptionEndDate:{
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Customer', CustomerSchema);
