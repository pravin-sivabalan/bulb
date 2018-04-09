let http = require('http');
let mongoose = require('mongoose');
require('dotenv').config();

let app = require('./routes/index');

app.server = http.createServer(app);
mongoose.connect(process.env.DB, { useMongoClient: true });

app.server.listen(process.env.PORT, () => {
		console.log(`Started on port ${app.server.address().port}`);
});
