/*--------------------------------------------------------------
 Use this script to show meeting information
 Requirement: Meeting ID
 Argument: none
----------------------------------------------------------------*/

const {ID, JWT} = require('./META');

function GetInfo() {
	var req = require("https").request({
		"method": "GET",
		"hostname": "api.zoom.us",
		"port": null,
		"path": `/v2/meetings/${ID}`,
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
			console.log(meeting);
			console.log(meeting.topic);
		});
	});

	req.end();
}

GetInfo()
