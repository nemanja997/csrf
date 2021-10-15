const express = require('express');
const fs = require('fs');
const path = require("path");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const csurf = require('csurf');

const PORT_NUMBER = 4000;

// csurf --- { cookie: true } --- this defines CSRF token implementation strategy (when set to true it uses double-submit cookie)
// used for STATELESS apps
// https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie

// csurf --- { cookie: false } --- uses Synchronizer Token Pattern (for this to work user session on server is required)
// used for STATEFULL apps
// https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern
var csrfProtection = csurf({ cookie: true });

// state
let bought = 0;

const app = express();
app.use(cookieParser());
app.use(express.json());


// { credentials: true } --- Access-Control-Allow-Credentials: true
// this is neccesary header to allow cross origin AJAX requests with cookies

// { origin: true } --- Access-Control-Allow-Origin: `${req.header('Origin')}`
// we can't use '*' when we have send credentials with AJAX request, you must define specific origin
// in practice, we should use this ONLY if we check the origin of the request and make sure its our 'whitelisted' origin
app.use(cors({ credentials: true, origin: true }));

app.get('/', csrfProtection, function(req, res) {
    const expires = new Date(Date.now() + 900000);

    // httpOnly doesn't protect us from this attack, but sameSite does
    res.cookie(`SESSION_COOKIE`,`asd`, {
        expires,
        // httpOnly: true,
        // sameSite: true
    });

    fs.readFile(path.resolve(__dirname, './index.html'), 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        // inject CSRF token into HTML meta tag
        data = `<meta content="${req.csrfToken()}" name="csrf-token" />` + data;

        res.send(data);
    });
});

// post route for buying stuff
app.post('/buy', csrfProtection, function(req, res) {
    // check user session
    if (req.cookies.SESSION_COOKIE === 'asd') {
        bought += 1;
        res.json({status: 'success', msg: 'Congrats!', bought })
    } else {
        res.json({status: 'failed', msg: 'User not logged in.'})
    }
});

app.listen(PORT_NUMBER, () => {
    console.log(`Victim listening at http://victim.com:${PORT_NUMBER}`)
});
