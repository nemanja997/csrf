const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');

const PORT_NUMBER = 3000;

app.use(cookieParser());
app.use(express.json());

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, './index.html'));
});

app.listen(PORT_NUMBER, () => {
    console.log(`Attacker listening at http://attacker.com:${PORT_NUMBER}`)
});
