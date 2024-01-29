# Voting App

Documentation for Voting App, a web application developed in Django and Django Rest Framework, with a ReactJS client. This application allows users to create, participate in, and manage interactive polls. Below is a detailed guide on the project structure, the technologies used, and how to run the application.

## Installation

```shell
# Clone the repository
git clone https://github.com/nivwer/VotingApp.git
cd VotingApp

# Install Django dependencies
pip install -r requirements.txt

# Django initial setup
python manage.py collectstatic --no-input
python manage.py migrate
python init_db.py

# Install ReactJS dependencies
cd client
npm install

```

## Environment Configuration

Set up the necessary environment variables for the project. Copy the `.env.example` file and rename it to `.env`, then modify the variables according to your needs.

## Django Server

To run the Django Server:

```shell
cd VotingApp

# ASGI server
uvicorn config.asgi:application
```

The App will be available at `http://localhost:8000`.

## API Polls

The Polls API manages polls, comments, user options, categories, and the search engine.

Some key features include:

- CRUD operations for surveys.
- User action management (votes, shares, and bookmarks).
- Comments on polls.
- Addition of custom options with a limit of 18 options per poll and one per user.
- Category system.
- Basic search engine.

## API Accounts

The Accounts API manages authentication, user registration, profile management, and profile search.

Some key features include:

- User registration, login, and logout.
- User profile creation.
- Basic profile search engine.

## ReactJS Client

The ReactJS client provides an interactive user interface for end-users. It communicates with the server to display polls, allow votes, comments, and other actions.

To run the client:

```shell
cd client

# Development.
npm run dev

# Preview
npm run preview

# Production
npm run build
```

The client will be available at `http://localhost:5173`.

For detailed information about the ReactJS client, refer to the [Client Documentation](/client/README.md).

## Database

- Polls API: Uses MongoDB as a database to store polls, comments, and user-customized options.
- Accounts API: Uses PostgreSQL to store information related to authentication, user profiles, and profile search.

Ensure your databases are configured correctly in the .env file.

## Security

- The Accounts API implements session-based authentication.
- Utilizes anti-CSRF protection with tokens.
- It is recommended to set up HTTPS to ensure secure communication between the client and the server.

## About

- License: [MIT](/LICENSE).
- Copyright © 2023-2024 [nivwer](https://github.com/nivwer).
