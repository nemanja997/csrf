const express = require('express');
const fs = require('fs');
const path = require("path");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const PORT_NUMBER = 4000;

// state
let ORDERS = [];

const app = express();
app.use(cookieParser());
app.use(express.json());


// { credentials: true } --- Access-Control-Allow-Credentials: true
// this is neccesary header to allow cross origin AJAX requests with cookies

// { origin: true } --- Access-Control-Allow-Origin: `${req.header('Origin')}`
// we can't use '*' when we have send credentials with AJAX request, you must define specific origin
// in practice, we should use this ONLY if we check the origin of the request and make sure its our 'whitelisted' origin
app.use(cors({ credentials: true, origin: true }));

app.get('/', function(req, res) {
    const expires = new Date(Date.now() + 900000);

    // httpOnly doesn't protect us from this attack, but sameSite does
    res.cookie(`SESSION_COOKIE`,`nemanja`, {
        expires,
        // httpOnly: true,
        // sameSite: true
    });

    fs.readFile(path.resolve(__dirname, './index.html'), 'utf8', function (err,data) {
        if (err) return console.log(err);
        res.send(data);
    });
});

// post route for buying stuff
app.post('/buy', function(req, res) {
    // check user session
    if (req.cookies.SESSION_COOKIE === 'nemanja') {
        ORDERS.push({ ...req.body, buyer: 'nemanja' });
        res.json({status: 'success', msg: 'You ordered successfully!', payload: {
                orders: ORDERS
            } })
    } else {
        res.json({status: 'failed', msg: 'User not logged in.'})
    }
});

app.listen(PORT_NUMBER, () => {
    console.log(`Victim listening at http://victim.com:${PORT_NUMBER}`)
});
