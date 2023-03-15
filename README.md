# WhatsThatAssignment

## Run server first located here: https://github.com/ash-williams/WhatsThat
1. Clone the repository into a directory on your local machine. If you have Git installed on your machine then you can run git clone https://github.com/ash-williams/whatsthat in your terminal
2. In the terminal, navigate to the directory where you have cloned the repository and run `npm install` to install the dependencies
3. Run the server with `npm run dev`
4. Test everything is working using Postman. The API documentation can be found by navigating to http://localhost:3333/api/1.0.0/documentation in your browser.

## Run Assignment project:
1. Clone the repository into a directory on your local machine. If you have Git installed on your machine then you can run git clone https://github.com/LordyMCR/WhatsThatAssignment in your terminal
2. In the terminal, navigate to the directory where you have cloned the repository and run `npm install` to install the dependencies
3. (ONLY IF RUNNING ON THE LAB MACHINES) Run `set NODE_OPTIONS=--openssl-legacy-provider`
4. Run `npm run web`

## Commit back to GitHub
See Git_GitHubCommands.txt

## API Checklist
### User Management
:x: Add a new user
:grey_question: Get user information
:x: Update user information
:heavy_check_mark: Log into an account
:heavy_check_mark: Log out of an account
:grey_question: Get a users profile photo
:x: Upload a profile photo
:grey_question: Search for users
### Contacts Management
:heavy_check_mark: View your contacts
:x: Add a contact
:x: Remove a contact
:heavy_check_mark: View all blocked users
:x: Block a user
:x: Unblock a user
### Chat Management
:heavy_check_mark: View your list of chats
:x: Start a new conversation
:x: View the details of a single chat
:x: Update chat information
:x: Add a user to the chat
:x: Remove a user from the chat
:heavy_check_mark: Send a message in the chat
:x: Update a message in the chat
:x: Delete a message in the chat