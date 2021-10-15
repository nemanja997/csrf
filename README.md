# csrf
CSRF demonstration and prevention.

Make sure you have `nodemon` installed globally to run the samples from this repo

1. Update **hosts** file with:
```
127.0.0.1 attacker.com
127.0.0.1 victim.com
```

2. `npm run victim-protected` / `npm run victim-unprotected`
3. `npm run attacker`

4. Visit `victim.com:4000` and `attaker.com:3000`
