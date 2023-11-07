import mongoose from 'mongoose'
// on windows maybe: 127.0.0.1
mongoose.connect('mongodb://localhost/productivity-dev')

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more lists
const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, minLength: 4},
  password: {type: String, required: true, minLength: 8},
  weeklyLists:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'weeklyList' }],
  notes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
});

// a task written inside of a weekly to-do list
// * includes either the duration of the task or how many parts have been completed
// * items in a list can be crossed off
const TaskSchema = new mongoose.Schema({
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
const weeklyListSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
  createdAt: {type: Date, default: Date.now(), required: true},
  tasks: [TaskSchema]
});

const NoteSchema = new mongoose.Schema({
    name: {type: String, required: true},
    createdAt: {type: Date, default: Date.now(), required: true},
    updatedAt: {type: Date, default: Date.now(), required: true},
    text: {type: String, required: false}
})

mongoose.model("User", UserSchema);
mongoose.model("Note", NoteSchema);
mongoose.model("weeklyList", weeklyListSchema);