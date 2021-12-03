//
// Usage: node add registrant@email.com "First Name" "Last Name"
//

const {ID, JWT} = require('./META');
var req = require("https").request({
    "method": "POST",
    "hostname": "api.zoom.us",
    "port": null,
    "path": `/v2/meetings/${ID}/registrants`,
    "headers": {
        "content-type": "application/json",
        "authorization": `Bearer ${JWT}`
    }} , res => {
    var chunks = [];

    res.on("data", chunk => {
        chunks.push(chunk);
    });

    res.on("end", () => {
        var body = Buffer.concat(chunks);
		var data = JSON.parse(body);
		console.log(data.email, data.join_url);
    });
});

function inject(email, first_name, last_name) {
	req.write(JSON.stringify({
		first_name: first_name,
		last_name: last_name,
		email: email,
		language: "zh-TW",
		auto_approve: true
		}));
	req.end();
}

function insert(email, first_name, last_name) {
	inject(email, first_name, last_name);
}

// argv[2] = registrant@email.com
// argv[3] = "First Name"
// argv[4] = "Last Name"
insert(process.argv[2], process.argv[3], process.argv[4])
