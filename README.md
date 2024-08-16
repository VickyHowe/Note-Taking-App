# Note-Taking-App

This application allows user specific notes to be:
    - created
    - modified
    - searched
    - deleted

    This application uses node.js to handle middlewares , SQLlite remote database, and react for front end JS and HTML.

## User Interface:

### Fixed
    
#### Header Navigation Bar
        - Logo - Onclick returns to landing page
        - Search - Visible only upon login
        - Home - If user logged it returns to "My Notes" Page, Otherwise uses "Guest" account


### Home Page
        - "Get Started" button linking to Login

### Login Page

#### Center Box:
        - Enter Email
        - Enter Password
        - Remember Me button
        - Forgot password link - emails temporary password
        - Statment of login agreening to Privacy Policy and terms of Service
        - Login Button
        - Guest Login Button
        - Not a member? Signup (link)

### New User Creation Page
#### Center Box:
        - Email address
        - Confirm e-mail
        - Enter a password
        - Confim password
        - First Name
        - Last Name
        - Box to signup to recieve promotional materials
        - Create Account Button - that verifies user is unique and all fields filled out
        - Already Have an account? Login (Link to Login Page)

### Profile Page

#### Center Box:
        - First Name : User Defined
        - Last Name : User Defined
        - Email : User Defined
        - ID : Assigned
        - Joined on : Assigned


### My Notes Page

#### Left Tab
        - Profile
        - Notes
        - Archives
        - Trash

#### Center Box
        - My Notes
        - Add Note button
        - Filter By:
            - search bar, color, labels, clear
        - card image of notes, click to edit, archive, delete


### ADD Note Popout
        - Enter Title
        - Enter text, font selectable, link image
        - Set Priority
        - Add Label
        - Change colour
        - Add Note/Update Note
        - Cancel

-----------------------------------------------
# This is a simple notetakeing app

## Frontend
/views
- HTML
- EJS
- JS
- Bootstrap

## Backend
- Node 
- Express

### Routing
/routes

## DB Connector
/db

## Database
- Sqlite

## Usage

```
npm install
npm start
```

## References 

https://www.youtube.com/watch?v=jins2yHN81s
https://github.com/jdesboeufs/connect-mongo/blob/HEAD/MIGRATION_V4.md

https://youtu.be/F-sFp_AvHc8



notetaking-app/

app.js

config/

db.js

models/

notetakingappSchema.js

note.js

routes/

index.js

notes.js

views/

index.ejs

new.ejs

edit.ejs

layout.ejs

public/

styles.css

package.json


images
https://www.pexels.com/photo/a-corkboard-with-blank-notes-8534461/
https://www.pexels.com/photo/blank-white-paper-sheet-on-wooden-table-4207707/
