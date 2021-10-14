const express = require('express');
const fs = require('fs');
const path = require("path");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const csrf = require('csurf');

// csurf --- { cookie: true } opcija definise nacin tehniku razmene CSRF tokena (u tom slucaju koristi Double-submit cookie)
// https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie

// csurf --- { cookie: false } koristi se Synchronizer Token Pattern i za njega je neophodno da cuvamo sesiju na Serveru
// https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern
var csrfProtection = csrf({ cookie: true });

// state
let kupljeno = 0;

const app = express();
app.use(cookieParser());
app.use(express.json());


// { credentials: true } --- Access-Control-Allow-Credentials: true
// this is neccesary header to allow cross origin AJAX requests with cookies

// { origin: true } --- Access-Control-Allow-Origin: `${req.header('Origin')}`
// we can't use '*' when we have send credentials with AJAX request, you must define specific origin
// in practice, we should use this ONLY if we check the origin of the request and make sure its our 'whitelisted' origin
app.use(cors({ credentials: true, origin: true }));

app.get('/',csrfProtection, function(req, res) {
    // httpOnly nas ne stiti od ovog napada
    res.cookie(`SESSION_COOKIE`,`asd`, { expires: new Date(Date.now() + 900000), httpOnly: true, sameSite: true });
    fs.readFile(path.resolve(__dirname, './index.html'), 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        // ubaciti CSRF token u meta tag stranice
        data = `<meta content="${req.csrfToken()}" name="csrf-token" />` + data;

        res.send(data);
    });
});

// post ruta za kupovinu sa autentifikacijom
app.post('/kupi',csrfProtection, function(req, res) {
    // proveri da li je user ulogovan
    if (req.cookies.SESSION_COOKIE === 'asd') {
        kupljeno += 1;
        res.json({status: 'success', msg: 'Cestitamo na kupovini!!!', kupljeno })
    } else {
        res.json({status: 'failed', msg: 'Nisi ulogovan!!!'})
    }
});

const port = 4000;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
