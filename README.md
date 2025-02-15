# ICS499-Bears

## Table of Contents

- [Summary](#summary)
- [Getting Started](#getting-started)
  - [App Setup](#app-setup)
  - [DB Setup](#db-setup)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Summary

This is a full-stack **Node.js** application designed to showcase **global dance culture**. It highlights various dance styles, their histories, and communities worldwide.

### Tech Stack:
- **Frontend:** Built with **Next.js (React)**
- **Backend:** Powered by **Node.js** with an API-driven architecture
- **Database:**
  - **SQLite** for local development  
  - **PostgreSQL** for production  

## Getting Started

### App Setup

#### 1️⃣ Clone the Repository
```sh
git clone git@github.com:olsonja88/ICS499-Bears.git
cd ICS499-Bears
```

#### 2️⃣ Install Homebrew (MacOS/Linux)
```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 3️⃣ Install Node.js
- **MacOS/Linux**
```sh
brew install node
```

- **Windows**
1. Download and install Node.js from https://nodejs.org/en
2. Verify installation
```sh
node -v
npm -v
```

#### 4️⃣ Install Dependencies
```sh
cd app
npm install
```
#### 5️⃣ Get environment variables
* Create a new file called `.env.local` under `/app`.
* Copy/paste the contents from Discord `#sprint-planning` chat.

#### 6️⃣ Start the Development Server
```sh
npm run dev
```
**Note:** In order to test the app locally, you must follow the "DB Setup" guide.

### DB Setup

#### 1️⃣ Install SQLite3
SQLite3 is required to manage the local database.

- **MacOS/Linux (via Homebrew):**  
  ```sh
  brew install sqlite
  ```
- **Windows**
1. Download the SQLite tools from https://www.sqlite.org/download.html
2. Under "Precompiled Binaries for Windows" package download `sqlite-tools-win-x64-3490000.zip`.
3. Unzip and place contents somewhere on your computer (e.g., C:\sqlite3\).
4. Add the SQLite binary location to your system PATH:
    1. Open Environment Variables
    2. Under System Variables, edit Path
    3. Click New and add the path to your SQLite folder
    4. Click OK to save the changes

#### 2️⃣ Run Database Migrations
```sh
cd app
npm run migrate
```

**Note:** Migration SQL files are stored in:
app/src/lib/migrations.  If you'd like to make changes to the DB, edit `init.sql`

## Project Structure
```
.
├── app/
│   ├── public/ # Static UI assets
│   └── src/
│       ├── app/
│       │   ├── api/ # Endpoints
│       │   ├── .
│       │   ├── . # Pages
│       │   └── .
│       ├── components/ # Shared UI components
│       └── lib/ # General utilities
│           └── migrations/ # DB SQL files
├── .env.local # Secrets
└── dev.db # SQLite DB
```

## Contributing
To contribute to this project, please follow these steps:
1. Assign yourself an issue from the "Issues" tab. [docs](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/assigning-issues-and-pull-requests-to-other-github-users)
2. Create a branch off of main for the issue. [docs](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-a-branch-for-an-issue)
3. Checkout the branch locally.
```sh
git fetch origin
git checkout <branch-name>
```
4. Complete work and code changes (commit and push as you go). [video tutorial](https://www.youtube.com/watch?v=9DHjfDuXMGA)
5. Open a pull request. [docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
6. Notify group members under `#review-requests`.
7. Wait for someone to review and approve.
8. Merge after review. [docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/merging-a-pull-request)
