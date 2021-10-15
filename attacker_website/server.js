const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const Tokens = require('csrf');

const tokens = new Tokens();

const PORT_NUMBER = 3000;

app.use(cookieParser());
app.use(express.json());

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, './index.html'));
});

app.get('/generate_csrf/:csrf_secret', function(req, res) {
    const csrfSecret = req.params.csrf_secret;
    var token = tokens.create(csrfSecret);
    res.json({ token })
});

app.listen(PORT_NUMBER, () => {
    console.log(`Attacker listening at http://attacker.com:${PORT_NUMBER}`)
});
