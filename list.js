/*--------------------------------------------------------------
 Use this script to show all registrants in a meeting
 Requirement: Meeting ID
 Argument: Document ID
----------------------------------------------------------------*/

const {ID, JWT} = require('./META');

var Registrants = [];

function PrintList() {
	console.log(`#	ID                  	First_Name     	Last_Name    	Email`);
	for (var i=Registrants.length-1; i>=0; i--) {
		var usr = Registrants[i];
		var index = Registrants.length - i;
		console.log(`${index}	${usr.id}	${usr.first_name}     	${usr.last_name||''}    	${usr.email}`);
	}
	// console.log(Registrants[0]); // debug
}

function GetList(page=1) {
	var req = require("https").request({
		"method": "GET",
		"hostname": "api.zoom.us",
		"port": null,
		"path": `/v2/meetings/${ID}/registrants?page_size=300&page_number=${page}`,
		"headers": {
			"authorization": `Bearer ${JWT}`
		}
	},	res => {
		var chunks = [];

		res.on("data", chunk => {
			chunks.push(chunk);
		});

		res.on("end", () => {
			var body = Buffer.concat(chunks);
			var meeting = JSON.parse(body.toString());
			if (meeting.code!==undefined) {
				console.log("Error:", meeting.message);
				process.exit();
			}
			meeting.registrants.map((registrant, index) => {
				Registrants.push(registrant);
				//console.log(registrant);
			});
			delete meeting.registrants;
			if (meeting.page_count > meeting.page_number)
				GetList(1 + meeting.page_number)
			else
				PrintList()
		});
	});

	req.end();
}

GetList()
