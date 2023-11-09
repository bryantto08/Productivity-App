
const devNotesApi = "http://localhost:3001/notes";
const prodNotesApi = "https://[prod]/notes";

// Given a username, retrieve a NotesList: GET /notes/{username}
export async function ListNotes(username) {
    const response = await fetch(devNotesApi + "/" + username, {
        method: 'GET',
    });
    const res = await response.json();
    return res;
}

// Given a username and note-id, retrieve the text of a specific Note: GET /notes/{username}/{note-id}
export async function readNote(username, data) {
    const response = await fetch(devNotesApi + "/" + username + "/" + data['note-id'], {
        method: 'GET',
    });
    const res = await response.json();
    return res;
}

// Given a username and notes data, create a Note: POST /notes/{username}
export async function createNote(username, data) {
    const response = await fetch(devNotesApi + "/" + username, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const res = await response.json();
    return res;
}

// Given a username and notes data Update a Note: PATCH /notes/{username}
export async function updateNote(username, data) {
    const response = await fetch(devNotesApi + "/" + username, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const res = await response.json();
    return res;
}

// Given a username and notes data Delete a Note: Delete /notes/{username}
export async function deleteNote(username, data) {
    const response = await fetch(devNotesApi + "/" + username, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const res = await response.json();
    return res;
}

