const devAuthApi = "http://localhost:3001";
const prodAuthApi = "https://[prod]";


// API Endpoint for Logging in a User POST /login
export async function login(data) {
    console.log(data);
    const response = await fetch(devAuthApi + "/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    console.log(response.headers.get('Set-Cookie'));
    const res = await response.json();
    return res;
}

// API Endpoint for Logging in a User POST /login
export async function register(data) {
    const response = await fetch(devAuthApi + "/register", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const res = await response.json();
    return res;
}

// API Endpoint for Authenticating a User based on session POST /session
export async function sessionAuth(data) {
    if (data['sessionId']) {
        const response = await fetch(devAuthApi + "/session", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'session-id': data['sessionId'].value
            },
            body: JSON.stringify({'username': data['username']})
        });
        const res = await response.json();
        return res;
    }
    else {
        return {'error': 'no sessionId given'}
    }

}