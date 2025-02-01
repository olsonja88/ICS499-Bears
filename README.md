# ICS499-Bears

# Project Setup Guide

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


## 🐘 PHP Project Setup

### **1️⃣ Install PHP**
**MacOS/Linux:**
```sh
brew install php
```

**Windows:**
1. Download PHP from [https://windows.php.net/download/](https://windows.php.net/download/)
2. Extract PHP (e.g., `C:\php`) and add it to **System Environment Variables > PATH**.
3. Verify installation:
```sh
php -v
```


### **3️⃣ Run PHP Built-in Server**

***CD into php***
```sh
cd php
```
***Run server***

```sh
php -S localhost:8000 -t public
```
Now open **http://localhost:8000/** in your browser.

---

### **4️⃣ PHP API Example**
Visit **http://localhost:8000/api/api.php** to see the JSON response.
