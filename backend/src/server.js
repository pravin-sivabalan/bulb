let http = require('http');
let mongoose = require('mongoose');
require('dotenv').config();

let app = require('./routes/index');

app.server = http.createServer(app);
mongoose.connect(process.env.DB, { useMongoClient: true });

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build/index.html'));
  });
}

app.server.listen(process.env.PORT, () => {
		console.log(`Started on port ${app.server.address().port}`);
});
