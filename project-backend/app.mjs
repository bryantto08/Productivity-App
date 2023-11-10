import express from 'express'
import argon2 from 'argon2'
import path from 'path'
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import './db.mjs'
import session from 'express-session';
import cors from 'cors';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({origin: '*'}));

// retrieve the constructor associated with User
const User = mongoose.model('User');
const Note = mongoose.model('Note');
var ObjectId = mongoose.Types.ObjectId;

// Session Middleware for Authentication of an account, the only API endpoints we do not check for authentication is the login and register endpoint
const checkUser = async (req, res, next) => {
    if (req.path === "/login" || req.path === "/register" || req.path === "/session") {
        next();
    }
    else {
        const sessionId = req.get('session-id');
        const path = req.path.split('/');
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
            res.status(401).json({'error': 'Not Authenticated User'});
        }
    }

}
// app.use(checkUser);

// GET API endpoint for Retrieving a List of Notes by a User
app.get("/notes/:username", async (req, res) => {
    const pattern = new RegExp(`^${req.params.username}$`, 'i');
    const foundUser = await User.findOne({username: pattern});
    if (foundUser) {
        try {
            const promises = foundUser.notes.map(async (id) => {
                const note = Note.findById(new ObjectId(id));
                return note;
            })
            const notesList = await Promise.all(promises);
            res.status(200).json({notes: notesList});
        }
        catch(e) {
            console.log(e);
            res.status.apply(500).json({error: e});
        }
    }
    else {
        res.status(404).json({error: 'User not Found'});
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
            res.status(200).json({success: 'true', data: note})
        }
        catch(e) {
            console.log(e);
            res.status(500).json({error: e})
        }
    }
});

// POST API endpoint for Adding a Note to the Database for a User
app.post("/notes/:username", async (req, res) => {
    // Implementation for getting the notes of a user
    const pattern = new RegExp(`^${req.params.username}$`, 'i');
    const foundUser = await User.findOne({username: pattern});
    if (foundUser) {
        try{
            const newNote = new Note({
                name: req.body.name || 'Untitled Note',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                text: req.body.text || ''
            });
            await newNote.save();
            const updateDoc = {$push: {notes: newNote}}
            const result = await User.findOneAndUpdate({username: req.params.username}, updateDoc);
            res.status(200).json({success: 'true', data: newNote});
        }
        catch(e){
            console.log(e);
            res.status(500).json({error: e})
        }
    }
    else {
        res.status(404).json({error: "no user found"});
    }
});

// PATCH API Endpoint to Update a Note for a User
app.patch('/notes/:username', async (req, res) => {
    console.log(req.body);
    const pattern = new RegExp(`^${req.params.username}$`, 'i');
    const foundUser = await User.findOne({username: pattern});
    if (foundUser) {
        try {
            const note = await Note.findById(new ObjectId(req.body['note-id']));
            note.name = req.body.name;
            note.text = req.body.text;
            note.updatedAt = Date.now();
            await note.save();
            res.status(200).json({'success': 'true', data: note});
        }
        catch(e) {
            console.log(e);
            res.status(500).json({'error': e});
        }
    }
    else {
        res.status(404).json({'error': 'user not found'});
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
            res.status(200).json({success: 'true'});
        }
        else {
            res.status(404).json({'error': 'note not found in database'});
        }
    }
    else {
        res.status(404).json({'error': 'user not found'});
    }
});

app.post('/session', async(req, res) => {
    console.log(req.body.username)
    const pattern = new RegExp(`^${req.body.username}$`, 'i');
    console.log(pattern);
    const foundUser = await User.findOne({username: pattern});
    const sessionId = req.get('session-id');
    if (foundUser) {
        if (foundUser.sessionId == sessionId) {
            res.status(200).json({success: 'true'});
        }
        else {
            res.status(401).json({error: "Unauthorized User"});
        }
    }
    else {
        res.status(400).json({error: 'Invalid Username'});
    }
});

// API Endpoint for logging in
app.post('/login', async(req, res) => {
    const pattern = new RegExp(`^${req.body.username}$`, 'i');
    const foundUser = await User.findOne({username: pattern});
    if (foundUser) {
        if (req.body.password && await argon2.verify(foundUser.password, req.body.password)) {
            res.append(`Set-Cookie`, `session-id=${foundUser.sessionId}; HttpOnly`);
            res.status(200).json({success: 'true', 'session-id': foundUser.sessionId});
        }
        else {
            res.status(400).json({error: 'Invalid Password'});
        }
    }
    else {
        res.status(400).json({error: 'Invalid Username'});
    }
});

// API endpoint for registering an account
app.post('/register', async (req, res) => {
    const pattern = new RegExp(`^${req.body.username}$`, 'i')
    const foundUser = await User.findOne({username: pattern})
    if (foundUser) {
        res.status(400).json({error: "username already exists"});
    }
    else {
        try {
            const user = new User({
                username: req.body.username,
                password: await argon2.hash(req.body.password)
            })
            const savedUser = await user.save();
            res.append(`Set-Cookie`, `session-id=${savedUser.sessionId}; HttpOnly`);
            res.status(200).json({success: 'true', 'session-id': savedUser.sessionId});
            
        }
        catch(e) {
            console.log(e);
            res.status(500).json({error: e});
        }
    }
})

app.listen(process.env.PORT || 3001);
