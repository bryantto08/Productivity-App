import express from 'express'
import argon2 from 'argon2'
import path from 'path'
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import './db.mjs'
import session from 'express-session';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// retrieve the constructor associated with User
const User = mongoose.model('User');
const Note = mongoose.model('Note');
var ObjectId = mongoose.Types.ObjectId;

// Session Middleware for Authentication of an account, the only API endpoints we do not check for authentication is the login and register endpoint
const checkUser = async (req, res, next) => {
    if (req.path === "/login" || req.path === "/register") {
        next();
    }
    else {
        const sessionId = req.get('session-id');
        const path = req.path.split('/');
        console.log(path.length);
        let pattern;
        if (path.length === 4) {
            pattern = new RegExp(`^${path[path.length - 2]}$`, 'i');
        }
        else {
            pattern = new RegExp(`^${path[path.length - 1]}$`, 'i');
        }
        const foundUser = await User.findOne({username: pattern});
        if (sessionId && sessionId == foundUser.sessionId) {
            next();
        }
        else {
            res.json({'error': 'Not Authenticated User'});
        }
    }

}
app.use(checkUser);

// GET API endpoint for Retrieving a List of Notes by a User
app.get("/notes/:username", async (req, res) => {
    const pattern = new RegExp(`^${req.params.username}$`, 'i');
    const foundUser = await User.findOne({username: pattern});
    if (foundUser) {
        try {
            console.log(foundUser.notes);
            const promises = foundUser.notes.map(async (id) => {
                const note = Note.findById(new ObjectId(id));
                return note;
            })
            const notesList = await Promise.all(promises);
            res.json({notes: notesList});
        }
        catch(e) {
            console.log(e);
            res.json({error: e});
        }
    }
});

// GET API endpoint for Retrieving a specific Note from a User
app.get("/notes/:username/:note", async (req, res) => {
    const pattern = new RegExp(`^${req.params.username}$`, 'i');
    const foundUser = await User.findOne({username: pattern});
    if (foundUser) {
        try{
            const note = await Note.findById(req.params.note);
            console.log(note);
            res.json({success: 'true', data: note})
        }
        catch(e) {
            console.log(e);
            res.json({error: e})
        }
    }
});

// POST API endpoint for Adding a Note to the Database for a User
app.post("/notes/:username", async (req, res) => {
    // CONFIRM USER IS AUTHENTICATED, session data

    // Implementation for getting the notes of a user
    console.log(req.params.username);
    const pattern = new RegExp(`^${req.params.username}$`, 'i');
    const foundUser = await User.findOne({username: pattern});
    if (foundUser) {
        try{
            const newNote = new Note({
                name: req.body.name || 'Untitled Note',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                text: req.body.text
            });
            await newNote.save();
            const updateDoc = {$push: {notes: newNote}}
            const result = await User.findOneAndUpdate({username: req.params.username}, updateDoc);
            res.json({success: 'true'});
        }
        catch(e){
            console.log(e);
            res.json({error: e})
        }
    }
    else {
        res.json({error: "no user found"});
    }
});

// PATCH API Endpoint to Update a Note for a User
app.patch('/notes/:username', async (req, res) => {
    // CONFIRM USER IS AUTHENTICATED, session data
    console.log('hello');
    const pattern = new RegExp(`^${req.params.username}$`, 'i');
    const foundUser = await User.findOne({username: pattern});
    if (foundUser) {
        try {
            const note = await Note.findById(new ObjectId(req.body['note-id']));
            note.text = req.body.text;
            note.updatedAt = Date.now();
            await note.save();
            res.json({'success': 'true'});
        }
        catch(e) {
            console.log(e);
            res.json({'error': e});
        }
    }
    else {
        res.json({'error': 'user not found'});
    }
});

// DELETE API endpoint to Delete a Note for a User
app.delete('/notes/:username', async (req, res) => {
    // CONFIRM USER IS AUTHENTICATED, session data
    const pattern = new RegExp(`^${req.params.username}$`, 'i');
    const foundUser = await User.findOne({username: pattern});
    if (foundUser) {
        const note = await Note.findById(new ObjectId(req.body["note-id"]));
        if (note) {
            const newUser = await User.findOneAndUpdate({username: foundUser.username}, {$pull: {notes: note.id}}, {new: true});
            await Note.findByIdAndRemove(note.id);
            console.log(newUser);
            res.json({success: 'true'});
        }
        else {
            res.json({'error': 'note not found in database'});
        }
    }
    else {
        res.json({'error': 'user not found'});
    }
});

// API Endpoint for logging in
app.post('/login', async(req, res) => {
    const pattern = new RegExp(`^${req.body.username}$`, 'i');
    const foundUser = await User.findOne({username: pattern});
    if (foundUser) {
        if (await argon2.verify(foundUser.password, req.body.password)) {
            console.log(foundUser);
            console.log(foundUser.sessionId);
            res.append(`Set-Cookie`, `session-id=${foundUser.sessionId}; HttpOnly`);
            res.json({success: 'true'});
        }
        else {
            res.json({error: 'Invalid Password'});
        }
    }
    else {
        res.json({error: 'Invalid Username'});
    }
});

// API endpoint for registering an account
app.post('/register', async (req, res) => {
    const pattern = new RegExp(`^${req.body.username}$`, 'i')
    const foundUser = await User.findOne({username: pattern})
    if (foundUser) {
        res.json({error: "username already exists"});
    }
    else {
        try {
            const user = new User({
                username: req.body.username,
                password: await argon2.hash(req.body.password)
            })
            const savedUser = await user.save();
            res.append(`Set-Cookie`, `session-id=${savedUser.sessionId}; HttpOnly`);
            res.json({success: 'true'});
            
        }
        catch(e) {
            console.log(e);
            res.json({error: e});
        }
    }
})

app.listen(process.env.PORT || 3000);
