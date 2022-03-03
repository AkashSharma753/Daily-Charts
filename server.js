//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const csv = require("fast-csv");
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
var MemoryStore = require('memorystore')(expressSession)
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

//app.use(express.static("public"));
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views',);
//app.use(express.urlencoded({ extended: true }));

//app.use(express.static("static"));
app.use(express.static(path.join(__dirname + '/public')));

//file  createWriteStream

// const mongoURI = require('./config/monKEY');
// mongoose.connect(mongoURI, {useNewUrlParser:true})
// .then(()=>{
//     console.log("Connected success")
// })
// .catch(()=>{
//     console.log("failed")
// })
//Kite API
const mongoURI = require('./config/monkoKEY');
mongoose.connect(mongoURI, { useNewUrlParser: true })
	.then(() => {
		console.log("Connected success")
	})
	.catch(() => {
		console.log("failed")
	})

app.use(cookieParser('random'));

app.use(expressSession({
	secret: "random",
	resave: true,
	saveUninitialized: false,
	// setting the max age to longer duration
	maxAge: 60 * 1000,
	store: new MemoryStore({
		checkPeriod: 86400000
	})
}));

app.use(csrf());
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function (req, res, next) {
	res.locals.success_messages = req.flash('success_messages');
	res.locals.error_messages = req.flash('error_messages');
	res.locals.error = req.flash('error');
	next();
});

app.use(require('./controller/routes.js'));

///////////////////////////////////////////
var KiteConnect = require("kiteconnect").KiteConnect;
var api_key = "25p9xeqglasz228l",
	secret = "4fza6lah9t1wtcsjch7fh3utxqb7sk2p",
	request_token = "1ni0Q45T4hU3n3rqsQ3eSmAwcKNE6tNo",
	access_token = "ZUYoKB7TF5OyU2hcpAuo5cRPV8hqyvyz";
var options = {
	"api_key": api_key,
	"debug": false
};

kc = new KiteConnect(options);
// kc.setSessionExpiryHooka(sessionHook);

var instrument = "";
var fromDate = "";
var toDate = "";
var time = "";
var company = "";

/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////
/////////////////////////////////////////////
////////////////////////////////////
//////////////////////////
//////////////////
///////
///


var openIndex = 0;
var pricearr = [];
var ohlc = [];
var o;
var h;
var l;
var c;
var xyz = 1;
var b = 0;
fs.unlinkSync('fake.csv');
fs.open('fake.csv', 'a', 666, function (e, id) {
	fs.write(id, ["Date", "Open", "High", "Low", "Close"] + "\n", null, 'utf8', function () {
		fs.close(id, function () {
			console.log('file is updated');
		});
	});
});
var i = 1;

app.post("/live", function (req, res) {
	// var price = 246;
	// var live = Math.floor(Math.random() * 150) + 1;

	// setInterval(function () {
	// 	var sign = Math.floor(Math.random() * 2) + 1;
	// 	if (sign === 1) {
	// 		price = Math.round(price + (live / 10));

	// 	} else {
	// 		price = Math.round(price - (live / 10));
	// 	}
	// 	i = i + 3;
	var time = req.body.time;

	if (!access_token) {
		kc.generateSession(request_token, secret)
			.then(function (response) {
				console.log("Response", response);
				console.log("response.access_token", response.access_token);
				init();
			})
			.catch(function (err) {
				console.log(err);
			})
	} else {
		kc.setAccessToken(access_token);
		getLTP();
	}
	var companyname = req.body.company;
	console.log(companyname);

	setInterval(function () {
		getLTP([companyname]);

	}, 1000);

	function getLTP(instruments) {
		kc.getLTP(instruments).then(function (response) {
			console.log(response);
			const keys = Object.keys(response);
			Object.entries(response).forEach(([key, value]) => {
				pricearr.push(value.last_price);
				console.log(pricearr);


				//pricearr.push(price);


				if (i === time * 60) {
					var currentdate = new Date();
					var datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()

					ohlc = [datetime, o, h, l, c];
					fs.writeFile('heading.csv', companyname.toString(), 'utf8', function (err) {
						if (err) {
							console.log('Some error occured - file either not saved or corrupted file saved.');
						} else {
							console.log('It\'s saved!');
						}
					});
					fs.writeFile('close.csv', c.toString(), 'utf8', function (err) {
						if (err) {
							console.log('Some error occured - file either not saved or corrupted file saved.');
						} else {
							console.log('It\'s saved!');
						}
					});
					//fs.unlinkSync('close.csv');
					// fs.open('close.csv', 'a', 666, function (e, id) {
					// 	fs.write(id,  [c.toString(),b++] + "\n", null, 'utf8', function () {
					// 		fs.close(id, function () {
					// 			console.log('file is updated');
					// 		});
					// 	});
					// });




					fs.open('fake.csv', 'a', 666, function (e, id) {
						fs.write(id, ohlc + "\n", null, 'utf8', function () {
							fs.close(id, function () {
								console.log('file is updated');
							});
						});
					});
					console.log("ohlc: " + ohlc);
					openIndex = 0;
					openIndex = openIndex + 59;
					var newo = pricearr[openIndex];

					pricearr = [];
					pricearr[0] = newo;
					o = newo;
					h = Math.max(...pricearr);
					l = Math.min(...pricearr);
					c = pricearr[(pricearr.length) - 1];
					i = 1;

				}
				else {
					o = pricearr[0];
					h = Math.max(...pricearr);
					l = Math.min(...pricearr);
					c = pricearr[(pricearr.length) - 1];
					i++;
				}

				console.log(pricearr);
				console.log("open: " + o, "high: " + h, "low: " + l, "close: " + c, "i: " + i);

				console.log("-------------------------------------------------");

			});

		}).catch(function (err) {
			console.log(err);
		})
	}






	// }, 3000)



	res.redirect('http://127.0.0.1:5500/live.html')
})

// app.get("/raat", function (req, res) {
// 	var price = 246;
// 	var live = Math.floor(Math.random() * 150) + 1;

// 	setInterval(function () {
// 		var sign = Math.floor(Math.random() * 2) + 1;
// 		if (sign === 1) {
// 			price = Math.round(price + (live / 10));

// 		} else {
// 			price = Math.round(price - (live / 10));
// 		}
// 		i = i + 3;


// 		pricearr.push(price);


// 		if (i % 60 === 0 && i !== 0) {
// 			var currentdate = new Date();
// 			var datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()

// 			ohlc=[datetime,o, h, l, c];
// 			fs.writeFile('close.csv', c.toString(), 'utf8', function (err) {
// 				if (err) {
// 				  console.log('Some error occured - file either not saved or corrupted file saved.');
// 				} else{
// 				  console.log('It\'s saved!');
// 				}
// 			  });




// 			fs.open('fake.csv', 'a', 666, function( e, id ) {
// 				fs.write( id,ohlc + "\n", null, 'utf8', function(){
// 				 fs.close(id, function(){
// 				  console.log('file is updated');
// 				 });
// 				});
// 			   });
// 			console.log("ohlc: " + ohlc);
// 			openIndex=0;
// 			openIndex = openIndex + 19;
// 			var newo = pricearr[openIndex];

// 			pricearr = [];
// 			pricearr[0] = newo;
// 			o = newo;
// 			h = Math.max(...pricearr);
// 			l = Math.min(...pricearr);
// 			c = pricearr[(pricearr.length) - 1];


// 		}
// 		else {
// 			o = pricearr[0];
// 			h = Math.max(...pricearr);
// 			l = Math.min(...pricearr);
// 			c = pricearr[(pricearr.length) - 1];

// 		}

// 		console.log(pricearr);
// 		console.log("open: " + o, "high: " + h, "low: " + l, "close: " + c);

// 		console.log("-------------------------------------------------");


// 	}, 3000)


// 	res.redirect('http://127.0.0.1:5500/live.html')

// })

/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////
/////////////////////////////////////////////
////////////////////////////////////
//////////////////////////
//////////////////
///////
///

















// app.post("/buy",function(req,res){

// 	console.log("dsa;lfjaldks");
// 	fs.readFile('close.csv', 'utf8', function (err, data) {
// 		console.log(data);  //Be careful if you are in a \r\n world...
// 		// Your array contains ['ID', 'D11', ... ]
// 	  })
// 	  res.redirect('http://127.0.0.1:5500/live.html');

// })




app.get("/samar", function (req, res) {
	if (!access_token) {
		kc.generateSession(request_token, secret)
			.then(function (response) {
				console.log("Response", response);
				console.log("response.access_token", response.access_token);
				init();
			})
			.catch(function (err) {
				console.log(err);
			})
	} else {
		kc.setAccessToken(access_token);
		init();
	}
	function init() {
		getQuote(["NSE:RELIANCE"]);
	}
	function getQuote(instruments) {
		kc.getQuote(instruments).then(function (response) {
			console.log(response);
		}).catch(function (err) {
			console.log(err);
		})
	}
})



app.get("/abc.html", function (req, res) {

	if (!access_token) {
		kc.generateSession(request_token, secret)
			.then(function (response) {
				console.log("Response", response);
				console.log("response.access_token", response.access_token);
				init();
			})
			.catch(function (err) {
				console.log(err);
			})
	} else {
		kc.setAccessToken(access_token);
		init();
	}
	function init() {

		getLTP(["NSE:RELIANCE"]);

		//getOHLC(["NSE:RELIANCE"]);
		// getInstruments();
		// getInstruments("NFO");
		// getQuote(["NSE:RELIANCE"]);
		// getHistoricalData(779521, "day", new Date("2018-01-01 18:05:00"), new Date("2018-01-10 18:05:37"));
		// getHistoricalData(779521, "day", "2018-01-01 18:05:00", "2018-01-10 18:05:37");

	}
	var lastp = [];
	var c = 0;
	var high;
	var x = [];
	var y = [];
	var z = 0;
	y.push(['Date', 'Open', 'High', 'Low', 'Close']);

	x.push(["Date", "Open", "High", "Low", "Close"]);

	var i = 0;
	function getLTP(instruments) {
		kc.getLTP(instruments).then(function (response) {
			//console.log(response);
			const ws1 = fs.createWriteStream(__dirname + '/livedata.csv');

			const keys = Object.keys(response);
			Object.entries(response).forEach(([key, value]) => {
				lastp.push(value.last_price);
				console.log(lastp);

				var l = lastp.length;
				close = lastp[l - 1];
				console.log("high");
				high = Math.max(...lastp);
				console.log(high);
				console.log("low");
				low = Math.min(...lastp)
				console.log(low);
				console.log("open close");
				console.log(open, close);
				var today = new Date();

				var dd = String(today.getDate()).padStart(2, '0');
				var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
				var yyyy = today.getFullYear();

				today = yyyy + '-' + mm + '-' + dd;
				x.push([today, open, high, low, close]);
				console.log("x :" + x);
				//csv.write(x).pipe(ws);
				csv.write(x).pipe(ws1);
				c = c + 2;
				open = x[z + 4];
				z = z + 4;


				if (c % 10 == 0) {
					var l1 = x.length;

					const ws = fs.createWriteStream(__dirname + '/lastcandle.csv');
					y.push(x[l1 - 1]);
					csv.write(y).pipe(ws);
				}
			});



			/////csv file live data


			//lastp.push(response[].body.last_price);
			//console.log(lastp);
		}).catch(function (err) {
			console.log(err);
		})
	}


	function getOHLC(instruments) {
		kc.getOHLC(instruments).then(function (response) {
			console.log(response);
			///////////////////////////////////////////////////

		}).catch(function (err) {
			console.log(err);
		})
	}

})
var newvar = "haha";
app.post("/form", function (req, res) {
	console.log("hrkmgfdc");
	instrument = req.body.instrument;
	fromDate = req.body.date1;
	toDate = req.body.date2;
	time = req.body.choice;
	company = req.body.instrument;
	console.log(instrument + fromDate + toDate + time);
	async function init() {
		kc.getLTP([company]).then(function (response) {
			console.log(response);
			const keys = Object.keys(response);
			Object.entries(response).forEach(([key, value]) => {
				newvar = value.instrument_token;
				console.log("newvar : " + newvar);
				getHistoricalData(newvar, time, fromDate + " 18:05:00", toDate + " 18:05:37");
				//getInstruments();
				console.log("hehe: " + newvar)
			})


		}).catch(function (err) {
			console.log(err);
		})

		//  getLTP([company]);
		console.log("companyNNNNNNNN:" + newvar);
		//getInstruments();
		//getHistoricalData(779521, "day", "2019-01-01 18:05:00", "2019-01-10 18:05:37");
		getHistoricalData(newvar, time, fromDate + " 18:05:00", toDate + " 18:05:37");
		//getInstruments();
		console.log("hehe: " + newvar)
	}
	if (!access_token) {
		kc.generateSession(request_token, secret)
			.then(function (response) {
				console.log("Response", response);
				console.log("response.access_token", response.access_token);
				init();
			})
			.catch(function (err) {
				console.log(err);
			})
	} else {
		kc.setAccessToken(access_token);
		init();
	}

	//   function getLTP(instruments) {
	// 	kc.getLTP(instruments).then(function(response) {
	// 		console.log(response);
	// 		const keys = Object.keys(response);
	// 						Object.entries(response).forEach(([key, value]) => {
	// 							newvar=value.instrument_token;
	// 							console.log("newvar : "+newvar);
	// 							})


	// 	}).catch(function(err) {
	// 		console.log(err);
	// 	})
	// 	//return newvar;
	// }

	function getQuote(instruments) {
		kc.getQuote(instruments).then(function (response) {
			console.log(response);
		}).catch(function (err) {
			console.log(err);
		})
	}


	function getHistoricalData(instrument_token, interval, from_date, to_date, continuous) {
		kc.getHistoricalData(instrument_token, interval, from_date, to_date, continuous)
			.then(function (response) {
				console.log(response);
				const x = [];
				x.push(["Date", "Open", "High", "Low", "Close", "Volume",instrument+","]);
				const ws = fs.createWriteStream(__dirname + '/my.csv');

				for (let i = 0; i < response.length; i++) {
					const c = new Date(response[i].date).toISOString().slice(0, 10);
					x.push([c, response[i].open, response[i].high, response[i].low, response[i].close, response[i].volume])
				}
				csv.write(x).pipe(ws);

			}).catch(function (err) {
				console.log(err);
			});
	}
	console.log("companyNNNNNNNN:" + newvar);
	res.redirect('http://127.0.0.1:5500/chartconnect.html');

})

// app.post("/form", function (req, res) {


// 	// instrument = req.body.instrument;
// 	company = req.body.instrument;
// 	getLTP();
// 	function getLTP(company) {
// 		kc.getLTP(company).then(function (response) {
// 			console.log(response);
// 			const keys = Object.keys(response);
// 			Object.entries(response).forEach(([key, value]) => {
// 				company = value.instrument_token;
// 				console.log(company);
// 			})


// 		}).catch(function (err) {
// 			console.log(err);
// 		})
// 	}
// 	fromDate = req.body.date1;
// 	toDate = req.body.date2;
// 	time = req.body.choice;
// 	//   console.log(instrument+fromDate+toDate+time);
// 	function init() {

// 		//getInstruments();
// 		//getHistoricalData(277888262, "day", "2019-01-01", "2019-01-10");
// 		getHistoricalData(instrument, time, fromDate + " 18:05:00", toDate + " 18:05:37");
// 		//getInstruments();

// 	}
// 	if (!access_token) {
// 		kc.generateSession(request_token, secret)
// 			.then(function (response) {
// 				console.log("Response", response);
// 				console.log("response.access_token", response.access_token);
// 				init();
// 			})
// 			.catch(function (err) {
// 				console.log(err);
// 			})
// 	} else {
// 		kc.setAccessToken(access_token);
// 		init();
// 	}


// 	function getQuote(instruments) {
// 		kc.getQuote(instruments).then(function (response) {
// 			console.log(response);
// 		}).catch(function (err) {
// 			console.log(err);
// 		})
// 	}


// 	function getHistoricalData(instrument_token, interval, from_date, to_date, continuous) {
// 		kc.getHistoricalData(instrument_token, interval, from_date, to_date, continuous)
// 			.then(function (response) {
// 				console.log(response);
// 				const x = [];
// 				x.push(["Date", "Open", "High", "Low", "Close", "Volume"]);
// 				const ws = fs.createWriteStream(__dirname + '/my.csv');

// 				for (let i = 0; i < response.length; i++) {
// 					const c = new Date(response[i].date).toISOString().slice(0, 10);
// 					x.push([c, response[i].open, response[i].high, response[i].low, response[i].close, response[i].volume])
// 				}
// 				csv.write(x).pipe(ws);

// 			}).catch(function (err) {
// 				console.log(err);
// 			});
// 	}


// 	//   function getHistoricalData(instrument_token, interval, from_date, to_date, continuous) {
// 	// 	kc.getHistoricalData(instrument_token, interval, from_date, to_date, continuous)
// 	// 		.then(function(response) {
// 	// 			console.log(response);
// 	// 		}).catch(function(err) {
// 	// 			console.log(err);
// 	// 		});
// 	// }

// 	res.redirect('http://127.0.0.1:5500/chartconnect.html');

// })





function getInstruments(exchange) {
	kc.getInstruments(exchange).then(function (response) {
		console.log(response);
	}).catch(function (err) {
		console.log(err);
	})
}
// function getHistoricalData(instrument_token, interval, from_date, to_date, continuous) {
// 	kc.getHistoricalData(instrument_token, interval, from_date, to_date, continuous)
// 		.then(function(response) {
// 			console.log(response);
//  			const x=[];
//  			x.push(["Date","Open","High","Low","Close","Volume"]);
//  			const ws = fs.createWriteStream('my.csv');
//
//  			for (let i = 0; i < response.length; i++) {
// 				 const c=new Date(response[i].date).toISOString().slice(0, 10);
//  				x.push([c,response[i].open,response[i].high,response[i].low,response[i].close,response[i].volume])
//  }
//  csv.write(x).pipe(ws);
//
// 		}).catch(function(err) {
// 			console.log(err);
// 		});
// }


// if(!access_token) {
// 	kc.generateSession(request_token, secret)
// 		.then(function(response) {
// 			console.log("Response", response);
// 				console.log("response.access_token",response.access_token);
// 			init();
// 		})
// 		.catch(function(err) {
// 			console.log(err);
// 		})
// } else {
// 	kc.setAccessToken(access_token);
// 	init();
// }




/////
app.get("/form", function (req, res) {
	res.render('signup')
})

app.post("/new", function (req, res) {
var compp=req.body.hehe;
console.log(compp);
if (!access_token) {
	kc.generateSession(request_token, secret)
		.then(function (response) {
			console.log("Response", response);
			console.log("response.access_token", response.access_token);
			init();
		})
		.catch(function (err) {
			console.log(err);
		})
} else {
	kc.setAccessToken(access_token);
	init();
}
function init(){
getQuote([compp]);
};
var livearr=[compp];
function getQuote(instruments) {
	kc.getQuote(instruments).then(function(response) {
		console.log(response);
		const keys = Object.keys(response);
Object.entries(response).forEach(([key, value]) => {
livearr.push(value.instrument_token,value.last_price,value.last_quantity,value.volume,value.ohlc.open,value.ohlc.high,value.ohlc.low,value.ohlc.close);
});
fs.open('liveinfo.csv', 'a', 666, function (e, id) {
	fs.write(id, livearr + "\n", null, 'utf8', function () {
		fs.close(id, function () {
			console.log('file is updated');
		});
	});
});


	}).catch(function(err) {
		console.log(err);
	})
}
console.log(livearr)

	res.render('displayliveinfo');
	
})
// app.get("/live",function(req,res){
// 	res.send("hii");
// })
app.post("/money", function (req, res) {
	console.log(req.body.mon);
	var m = req.body.mon;
	fs.writeFile('money.csv', m, 'utf8', function (err) {
		if (err) {
			console.log('Some error occured - file either not saved or corrupted file saved.');
		} else {
			console.log('It\'s saved!');
		}
	});
	res.render("profile");

})


let port = process.env.PORT;
if (port == null || port == "") {
	port = 8000;
}

app.listen(port, function () {
	console.log("server started on port 8000");
});
