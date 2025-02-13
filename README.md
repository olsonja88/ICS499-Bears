# ICS499-Bears

# Getting Started

## Git clone the Repo!
```sh
git clone git@github.com:olsonja88/ICS499-Bears.git
cd ICS499-Bears
```

## (MacOS/Linux) Install Brew
```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 🚀 Next.js (React) Project Setup

### **1️⃣ Install Prerequisites**
**MacOS/Linux:**

```sh
brew install node
```

**Windows:**
1. Download and install Node.js from [https://nodejs.org/](https://nodejs.org/)
2. Verify installation:
```sh
node -v
npm -v
```

### **2️⃣ CD into app + install**
```sh
cd app
npm i
```

### **3️⃣ Start Development Server**
```sh
npm run dev  # OR yarn dev
```
Open **http://localhost:3000/** in your browser.

# Project Structure
```
.
└── app/
    ├── public # Static frontend assets
    └── src/
        ├── app/
        │   ├── api # API endpoints, request, & queries
        │   ├── dance/
        │   │   └── page.tsx # Dances page 
        │   ├── page.tsx # Home page
        │   └── migrations # DB schema migrations and data seeding scripts
        ├── components # Shared frontend components
        └── lib # Project utilities and tools
```
