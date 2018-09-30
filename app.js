const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/newsary', {useNewUrlParser: true})
	.then(() => {console.log('MongoDb connected...')})
	.catch(err => {console.log(err)});

const db = mongoose.connection;

const Customer = require('./models/customers');

app.set('view engine', 'ejs');
app.use(expressLayouts);

//Middleware :: Populate body object and add to req object, to parse incoming data
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
	let subscribers = [];
	let divisions = [];
	res.render('index',{subscribers, divisions});
});

app.post('/data/subscribers', (req, res) => {
	let monthquery;
	let subscribers = [];

	if((req.body.month).toUpperCase() == 'JANUARY')	monthquery = 'Jan';
	else if((req.body.month).toUpperCase() == 'FEBRUARY')	monthquery = 'Feb';
	else if((req.body.month).toUpperCase() == 'MARCH')	monthquery = 'Mar';
	else if((req.body.month).toUpperCase() == 'APRIL')	monthquery = 'APR';
if(monthquery == 'Jan' || monthquery == 'Feb' || monthquery == 'Mar' || monthquery == 'Apr'){
	Customer.find({SubscriptionStartDate: { $regex: monthquery, $options: 'i' }})
		.countDocuments()
		.then(count => {
			console.log('Gain: ', count);
			subscribers.push({Gain: count});

			Customer.find({SubscriptionEndDate: { $regex: monthquery, $options: 'i' }})
				.countDocuments()
				.then(count => {
					console.log('Lost: ', count);
					
					subscribers.push({Lost: count});
					
					res.render('index', {
						subscribers: subscribers,
						divisions: []
					});	
				})
				.catch(err => {
					console.log(err);
				});	
		})
		.catch(err => {
			console.log(err);
		});		
} else{
	//For Month Other Then ["January", "february", "March", "April"], redirect to Index page:: i.e No data
		res.render('index',{
			divisions: [],
			subscribers: []
		});
}
});

/*
1- Disruptor
2- Liberator
3- GameChanger
*/

app.post('/data/division', (req, res) => {
	let monthquery;// = req.params.month;//'Mar';
	let divisions = [];

	if((req.body.month).toUpperCase() == 'JANUARY')	monthquery = 'Jan';
	else if((req.body.month).toUpperCase() == 'FEBRUARY')	monthquery = 'Feb';
	else if((req.body.month).toUpperCase() == 'MARCH')	monthquery = 'Mar';
	else if((req.body.month).toUpperCase() == 'APRIL')	monthquery = 'Apr';

if(monthquery == 'Jan'){
	Customer.count(
	       {"$and": [{"SubscriptionType": "Disruptor"},{"SubscriptionStartDate":{ $regex: 'Jan', $options: 'i' } }] 
	       }, function(err, res1){
	       		if(err)	console.log(err);
	       		else{
	       			divisions.push({Disruptor: res1});
	       			
	       			Customer.count(
				       {"$and": [{"SubscriptionType": "Liberator"},{"SubscriptionStartDate":{ $regex: 'Jan', $options: 'i' } }] 
				       }, function(err, res2){
				       		if(err)	console.log(err);
				       		else{
				       			divisions.push({Liberator: res2});
				    
				       			Customer.count(
							       {"$and": [{"SubscriptionType": "GameChanger"},{"SubscriptionStartDate":{ $regex: 'Jan', $options: 'i' } }] 
							       }, function(err, res3){
							       		if(err)	console.log(err);
							       		else{
							       			divisions.push({GameChanger: res3});
							       			res.render('index', {
												divisions: divisions,
												subscribers: []
											});	
		}} );}});}});	
	} else if(monthquery == 'Feb'){

		Customer.count(
	       {"$and": [{"SubscriptionType": "Disruptor"},{"SubscriptionStartDate":{ $regex: 'Feb', $options: 'i' } }] 
	       }, function(err, res1){
	       		if(err)	console.log(err);
	       		else{	       			
	       			Customer.count(
	      				{"$and": [
							{"SubscriptionType": "Disruptor"},
							{"SubscriptionStartDate":{ $regex: 'Jan', $options: 'i' }},
							{	"$or":	[
									{"SubscriptionEndDate": { $regex: 'Feb', $options: 'i' }},
									{"SubscriptionEndDate": { $regex: 'Mar', $options: 'i' }},
									{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
								]
							}
	       				]}, function(err, res2){
			       				if(err)	console.log(err);
			       				else{
							 	   	let total = res1 + res2;
	       							divisions.push({Disruptor: total});
//=======================Liberator
	       							Customer.count(
								       {"$and": [{"SubscriptionType": "Liberator"},{"SubscriptionStartDate":{ $regex: 'Feb', $options: 'i' } }] 
								       }, function(err, res1){
								       		if(err)	console.log(err);
								       		else{
								       			
								       			Customer.count(
								      				{"$and": [
														{"SubscriptionType": "Liberator"},
														{"SubscriptionStartDate":{ $regex: 'Jan', $options: 'i' }},
														{	"$or":	[
																{"SubscriptionEndDate": { $regex: 'Feb', $options: 'i' }},
																{"SubscriptionEndDate": { $regex: 'Mar', $options: 'i' }},
																{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
															]
														}
								       				]}, function(err, res2){
										       				if(err)	console.log(err);
										       				else{
														 	   	let total = res1 + res2;
								       							divisions.push({Liberator: total});

//======================== 'GameChanger'				
								       							Customer.count(
															       {"$and": [{"SubscriptionType": "GameChanger"},{"SubscriptionStartDate":{ $regex: 'Feb', $options: 'i' } }] 
															       }, function(err, res1){
															       		if(err)	console.log(err);
															       		else{
															       			
															       			Customer.count(
															      				{"$and": [
																					{"SubscriptionType": "GameChanger"},
																					{"SubscriptionStartDate":{ $regex: 'Jan', $options: 'i' }},
																					{	"$or":	[
																							{"SubscriptionEndDate": { $regex: 'Feb', $options: 'i' }},
																							{"SubscriptionEndDate": { $regex: 'Mar', $options: 'i' }},
																							{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
																						]
																					}
															       				]}, function(err, res2){
																	       				if(err)	console.log(err);
																	       				else{
																					 	   	let total = res1 + res2;
															       							divisions.push({GameChanger: total});

															       							res.render('index', {
																								divisions: divisions,
																								subscribers: []
																							});	
		}});} });}});}} );}});} });
	} else if(monthquery == 'Mar'){
		
		Customer.count(
	       {"$and": [{"SubscriptionType": "Disruptor"},{"SubscriptionStartDate":{ $regex: 'Mar', $options: 'i' } }] 
	       }, function(err, res1){
	       		if(err)	console.log(err);
	       		else{
	       			Customer.count(
	      				{"$and": [
							{"SubscriptionType": "Disruptor"},
							{"SubscriptionStartDate":{ $regex: 'Jan', $options: 'i' }},
							{	"$or":	[
									{"SubscriptionEndDate": { $regex: 'Mar', $options: 'i' }},
									{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
								]
							}
	       				]}, function(err, res2){
			       				if(err)	console.log(err);
			       				else{
			 	   					Customer.count(
					      				{"$and": [
											{"SubscriptionType": "Disruptor"},
											{"SubscriptionStartDate":{ $regex: 'Feb', $options: 'i' }},
											{	"$or":	[
													{"SubscriptionEndDate": { $regex: 'Mar', $options: 'i' }},
													{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
												]
											}
					       				]}, function(err, res3){
							       				if(err)	console.log(err);
							       				else{
							 	   					let total = res1 + res2 + res3;
													divisions.push({Disruptor: total});

//==============================Liberator'				 	   
		
													Customer.count(
												       {"$and": [{"SubscriptionType": "Liberator"},{"SubscriptionStartDate":{ $regex: 'Mar', $options: 'i' } }] 
												       }, function(err, res1){
												       		if(err)	console.log(err);
												       		else{
												       			Customer.count(
												      				{"$and": [
																		{"SubscriptionType": "Liberator"},
																		{"SubscriptionStartDate":{ $regex: 'Jan', $options: 'i' }},
																		{	"$or":	[
																				{"SubscriptionEndDate": { $regex: 'Mar', $options: 'i' }},
																				{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
																			]
																		}
												       				]}, function(err, res2){
														       				if(err)	console.log(err);
														       				else{
														 	   					Customer.count(
																      				{"$and": [
																						{"SubscriptionType": "Liberator"},
																						{"SubscriptionStartDate":{ $regex: 'Feb', $options: 'i' }},
																						{	"$or":	[
																								{"SubscriptionEndDate": { $regex: 'Mar', $options: 'i' }},
																								{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
																							]
																						}
																       				]}, function(err, res3){
																		       				if(err)	console.log(err);
																		       				else{

																		 	   					let total = res1 + res2 + res3;
																								divisions.push({Liberator: total});

//=================================='GameChanger'							 	   
																								Customer.count(
																							       {"$and": [{"SubscriptionType": "GameChanger"},{"SubscriptionStartDate":{ $regex: 'Mar', $options: 'i' } }] 
																							       }, function(err, res1){
																							       		if(err)	console.log(err);
																							       		else{
																							       			Customer.count(
																							      				{"$and": [
																													{"SubscriptionType": "GameChanger"},
																													{"SubscriptionStartDate":{ $regex: 'Jan', $options: 'i' }},
																													{	"$or":	[
																															{"SubscriptionEndDate": { $regex: 'Mar', $options: 'i' }},
																															{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
																														]
																													}
																							       				]}, function(err, res2){
																									       				if(err)	console.log(err);
																									       				else{
																									 	   					Customer.count(
																											      				{"$and": [
																																	{"SubscriptionType": "GameChanger"},
																																	{"SubscriptionStartDate":{ $regex: 'Feb', $options: 'i' }},
																																	{	"$or":	[
																																			{"SubscriptionEndDate": { $regex: 'Mar', $options: 'i' }},
																																			{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
																																		]
																																	}
																											       				]}, function(err, res3){
																													       				if(err)	console.log(err);
																													       				else{
																													 	   					let total = res1 + res2 + res3;
																																			divisions.push({GameChanger: total});

																																			res.render('index', {
																																				divisions: divisions,
																																				subscribers: []
																																			});	
		}});}});}});}});}});} });}});}});}});
	} else if( monthquery == 'Apr') {
Customer.count(
      {"$and": [{"SubscriptionType": "Disruptor"},{"SubscriptionStartDate":{ $regex: 'Apr', $options: 'i' } }] 
       }, function(err, res1){
       		if(err)	console.log(err);
       		else{
       			Customer.count(
      				{"$and": [
						{"SubscriptionType": "Disruptor"},
						{"SubscriptionStartDate":{ $regex: 'Jan', $options: 'i' }},
						{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
       				]}, function(err, res2){
		       				if(err)	console.log(err);
		       				else{
		 	   					Customer.count(
				      				{"$and": [
										{"SubscriptionType": "Disruptor"},
										{"SubscriptionStartDate":{ $regex: 'Feb', $options: 'i' }},
										{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
				       				]}, function(err, res3){
						       				if(err)	console.log(err);
						       				else{
						 	   					Customer.count(
								      				{"$and": [
														{"SubscriptionType": "Disruptor"},
														{"SubscriptionStartDate":{ $regex: 'Mar', $options: 'i' }},
														{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
								       				]}, function(err, res4){
										       				if(err)	console.log(err);
										       				else{
										 	   					let total = res1 + res2 + res3 + res4;
										 	   					divisions.push({Disruptor: total});

																//================================= 'Liberator'
																Customer.count(
																      {"$and": [{"SubscriptionType": "Liberator"},{"SubscriptionStartDate":{ $regex: 'Apr', $options: 'i' } }] 
																       }, function(err, res1){
																       		if(err)	console.log(err);
																       		else{
																       			Customer.count(
																      				{"$and": [
																						{"SubscriptionType": "Liberator"},
																						{"SubscriptionStartDate":{ $regex: 'Jan', $options: 'i' }},
																						{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
																       				]}, function(err, res2){
																		       				if(err)	console.log(err);
																		       				else{
																		 	   					Customer.count(
																				      				{"$and": [
																										{"SubscriptionType": "Liberator"},
																										{"SubscriptionStartDate":{ $regex: 'Feb', $options: 'i' }},
																										{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
																				       				]}, function(err, res3){
																						       				if(err)	console.log(err);
																						       				else{
																						 	   					Customer.count(
																								      				{"$and": [
																														{"SubscriptionType": "Liberator"},
																														{"SubscriptionStartDate":{ $regex: 'Mar', $options: 'i' }},
																														{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
																								       				]}, function(err, res4){
																										       				if(err)	console.log(err);
																										       				else{
																										 	   					let total = res1 + res2 + res3 + res4;
																										 	   					divisions.push({Liberator: total});
//=============================GameChanger
																																Customer.count(
																																      {"$and": [{"SubscriptionType": "GameChanger"},{"SubscriptionStartDate":{ $regex: 'Apr', $options: 'i' } }] 
																																       }, function(err, res1){
																																       		if(err)	console.log(err);
																																       		else{
																																       			Customer.count(
																																      				{"$and": [
																																						{"SubscriptionType": "GameChanger"},
																																						{"SubscriptionStartDate":{ $regex: 'Jan', $options: 'i' }},
																																						{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
																																       				]}, function(err, res2){
																																		       				if(err)	console.log(err);
																																		       				else{
																																		 	   					Customer.count(
																																				      				{"$and": [
																																										{"SubscriptionType": "GameChanger"},
																																										{"SubscriptionStartDate":{ $regex: 'Feb', $options: 'i' }},
																																										{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
																																				       				]}, function(err, res3){
																																						       				if(err)	console.log(err);
																																						       				else{
																																						 	   					Customer.count(
																																								      				{"$and": [
																																														{"SubscriptionType": "GameChanger"},
																																														{"SubscriptionStartDate":{ $regex: 'Mar', $options: 'i' }},
																																														{"SubscriptionEndDate": { $regex: 'Apr', $options: 'i' }}
																																								       				]}, function(err, res4){
																																										       				if(err)	console.log(err);
																																										       				else{
																																										 	   					let total = res1 + res2 + res3 + res4;
																																										 	   					divisions.push({GameChanger: total});
																																										 	   					
																																											 	   				res.render('index', {
																																																	divisions: divisions,
																																																	subscribers: []
																																																});	
		}});}});	} });}})} });}});} });}})}});} });} });}})
	} else {
		//For Month Other Then ["January", "february", "March", "April"], redirect to Index page:: i.e No data
		res.render('index',{
			divisions: [],
			subscribers: []
		});

	}

});

app.get('/about', (req, res) => {
	res.render('about');
});

const port = 3000;
app.listen(port, () => {
	console.log(`server is started on port ${port}`);
});