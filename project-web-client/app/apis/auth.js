const devAuthApi = "http://localhost:3001";
const prodAuthApi = "https://[prod]";


// API Endpoint for Logging in a User POST /login
export async function login(data) {
    const response = await fetch(devAuthApi + "/login", {
        method: "POST",
        body: {'username': data['username'], 'password': data['password']}
    });
    const res = await response.json();
    return res;
}

// API Endpoint for Logging in a User POST /login
export async function register(data) {
    const response = await fetch(devAuthApi + "/register", {
        method: "POST",
        body: {'username': data['username'], 'password': data['password']}
    });
    const res = await response.json();
    return res;
}

// API Endpoint for Authenticating a User based on session POST /session
export async function sessionAuth(data) {
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