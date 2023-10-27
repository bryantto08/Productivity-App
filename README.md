# LifePremium

## Overview

(__TODO__: a brief one or two paragraph, high-level description of your project)

Organizing your goals and tasks that you need to complete is an essential part of building a more productive and healthier life. LifePremium is a web application that allows you to keep track of any responsibility you need to do as well as containing a platform for effective note-taking. 

Users will have two different tabs, one as a To-Do List where users can set daily or weekly goals they want to achieve. These goals can be marked as complete or incomplete and analytics will be provided based on these specific goals.

The second tab will contain a note-taking feature that allows users to take notes both effectively and efficiently through the help of supplementary AI tools.

## Data Model

(__TODO__: a description of your application's data and their relationships to each other) 

The application will store Users, Tasks, WeeklyLists, and Notes

* users can have multiple lists (via references)
* each list can have multiple items (by embedding)

(__TODO__: sample documents)

An Example User:

```javascript
{
  username: "javascriptfannumber1",
  hash: // a password hash,
  weeklyLists: // an array of references to weeklyLists documents
}
```

An Example weeklyList with Embedded Tasks:

```javascript
{
  user: // a reference to a User object
  tasks: [
    { name: "exercise", duration: "30:00", checked: false},
    { name: "AIT HW", partsCompleted: "4/4", checked: true},
  ],
  createdAt: // timestamp
}
```
An Example Note Document:

```javascript
{
  user: // a reference to a User object
  name: "AIT Notes",
  text: "JavaScript is so weird! Firstly, it is a weakly typed language. Also, wat are prototypes??!?!"
}
```

## [Link to Commented First Draft Schema](db.mjs) 

## Wireframes

/weeklyList - page for showing and editing weeklyList and Tasks

![list](documentation/example-doc-to-do.png)

/notes - page for showing notes of a user

![list](documentation/example-doc-notes.png)

/login - page for logging in

![list](documentation/example-login.png)

/sign-up - page for signing up

![list](documentation/example-sign-up.png)

## Site map

(__TODO__: draw out a site map that shows how pages are related to each other)

Here's a [complex example from wikipedia](https://upload.wikimedia.org/wikipedia/commons/2/20/Sitemap_google.jpg), but you can create one without the screenshots, drop shadows, etc. ... just names of pages and where they flow to.

## User Stories or Use Cases

(__TODO__: write out how your application will be used through [user stories](http://en.wikipedia.org/wiki/User_story#Format) and / or [use cases](https://en.wikipedia.org/wiki/Use_case))

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new grocery list
4. as a user, I can view all of the grocery lists I've created in a single list
5. as a user, I can add items to an existing grocery list
6. as a user, I can cross off items in an existing grocery list

## Research Topics

(__TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed)

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
    * And account has been made for testing; I'll email you the password
    * see <code>cs.nyu.edu/~jversoza/ait-final/register</code> for register page
    * see <code>cs.nyu.edu/~jversoza/ait-final/login</code> for login page
* (4 points) Perform client side form validation using a JavaScript library
    * see <code>cs.nyu.edu/~jversoza/ait-final/my-form</code>
    * if you put in a number that's greater than 5, an error message will appear in the dom
* (5 points) vue.js
    * used vue.js as the frontend framework; it's a challenging library to learn, so I've assigned it 5 points

10 points total out of 8 required points (___TODO__: addtional points will __not__ count for extra credit)


## [Link to Initial Main Project File](app.mjs) 

(__TODO__: create a skeleton Express application with a package.json, app.mjs, views folder, etc. ... and link to your initial app.mjs)

## Annotations / References Used

(__TODO__: list any tutorials/references/etc. that you've based your code off of)

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [tutorial on vue.js](https://vuejs.org/v2/guide/) - (add link to source code that was based on this)
