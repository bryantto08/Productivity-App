// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more lists
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  weeklyLists:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'weeklyList' }]
});

// a task written inside of a weekly to-do list
// * includes either the duration of the task or how many parts have been completed
// * items in a list can be crossed off
const Task = new mongoose.Schema({
  name: {type: String, required: true},
  duration: {type: Date, default: Date.now(), required: false},
  partsCompleted: {type: String, default: '0/4', required: false},
  checked: {type: Boolean, default: false, required: true}
}, {
  _id: true
});

// a weeklyList
// * each list must have a related user
// * a list can have 0 or more tasks
const weeklyList = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
  createdAt: {type: Date, default: Date.now(), required: true},
  tasks: [Task]
});

const Note = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    name: {type: String, required: true},
    createdAt: {type: Date, default: Date.now(), required: true},
    updatedAt: {type: Date, default: Date.now(), required: true},
    text: {type: String, required: false}
})

mongoose.model("User", User);
mongoose.model("Note", Note);
mongoose.model("weeklyList", weeklyList);