const http = require('http');

function post(path, data) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    console.log(`Response Code: ${res.statusCode}`);
                    console.log(`Response Body: ${data}`);
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(body);
        req.end();
    });
}

(async () => {
    try {
        const email = `test_${Date.now()}@example.com`;
        const password = "password123";

        console.log(`\nTesting Signup with email: ${email}`);
        await post('/api/auth/signup', { email, password });

        console.log(`\nTesting Login with same credentials...`);
        await post('/api/auth/login', { email, password });

    } catch (err) {
        console.error("Test Error:", err);
    }
})();
