/*--------------------------------------------------------------
 Use this script to show all attendee's join_url of a meeting
 Requirement: Meeting ID
 Argument: none
----------------------------------------------------------------*/

const {ID, JWT} = require('./META');

var Registrants = [];

function PrintList() {
	console.log(`#	First_Name	Last_Name	Email	Join_URL`);
	for (var i=Registrants.length-1; i>=0; i--) {
		var registrant = Registrants[i];
		var index = Registrants.length - i;
		console.log(`${index}	${registrant.first_name}	${registrant.last_name||''}	${registrant.email}	${registrant.join_url}`);
	}
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
