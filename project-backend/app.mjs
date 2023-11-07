import express from 'express'
import argon2 from 'argon2'
import path from 'path'
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import './db.mjs'

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
import session from 'express-session'

const sessionOptions = { 
    secret: 'secret for signing session id', 
    saveUninitialized: false, 
    resave: false 
}
app.use(session(sessionOptions))
// retrieve the constructor associated with User
const User = mongoose.model('User');
const Note = mongoose.model('Note');
var ObjectId = mongoose.Types.ObjectId;

app.get("/notes/:username", async (req, res) => {
    // CONFIRM USER IS AUTHENTICATED, session data
    const pattern = new RegExp(`^${req.params.username}$`, 'i');
    const foundUser = await User.findOne({username: pattern});
    if (foundUser) {
        try{
            console.log(foundUser.notes);
            const notesList = await foundUser.notes.map(async (id) => {
                console.log(id);
                const halp = await Note.findById(new ObjectId(id));
                console.log(halp);
                return halp;
            })
            console.log(notesList);
            res.json({notes: notesList});
        }
        catch(e) {
            console.log(e);
            res.json({error: e});
        }
    }
})

app.post("/notes/:username", async (req, res) => {
    // CONFIRM USER IS AUTHENTICATED, session data
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
})

app.post('/login', async(req, res) => {
    const pattern = new RegExp(`^${req.body.username}$`, 'i');
    const foundUser = await User.findOne({username: pattern});
    if (foundUser) {
        if (await argon2.verify(foundUser.password, req.body.password)) {
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

app.post('/register', async (req, res) => {
    console.log(req.body);
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
            res.json({success: 'true'});
            
        }
        catch(e) {
            console.log(e);
            res.json({error: e});
        }
    }
})

app.listen(process.env.PORT || 3000);
