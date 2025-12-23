# TopHat-Tracker
Notifies you of TopHat questions on desktop

## Description
This tool monitors your TopHat course page and sends desktop notifications when new questions are posted.

## Dependencies
- Node.js (v14 or higher)
- puppeteer
- node-notifier

## Getting Started

### Clone the Repository
```bash
git clone https://github.com/codingnerdwdwd/TopHat-Tracker.git
cd TopHat-Tracker
```

### Setup
1. Install dependencies:
```bash
npm install
```

2. Configure your TopHat URL:
   - Open `TopHatNotifier.js`
   - Replace `<TOPHAT_URL>` with your TopHat course page URL
   - Navigate to the course page where it shows "unanswered questions" and paste that URL

3. Run the application:
```bash
npm start
```

## How to Contribute (Upload Changes to Git)

### First Time Setup
1. Fork the repository on GitHub (click the "Fork" button)
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/TopHat-Tracker.git
cd TopHat-Tracker
```

### Making Changes
1. Create a new branch for your changes:
```bash
git checkout -b my-feature-branch
```

2. Make your changes to the code

3. Stage your changes:
```bash
git add .
```

4. Commit your changes:
```bash
git commit -m "Description of your changes"
```

5. Push to your fork:
```bash
git push origin my-feature-branch
```

6. Create a Pull Request on GitHub from your branch

### If You Have Write Access
If you have direct write access to the repository:

1. Make your changes to the code

2. Stage your changes:
```bash
git add .
```

3. Commit your changes:
```bash
git commit -m "Description of your changes"
```

4. Push to the repository:
```bash
git push origin main
```

## Configuration
You can adjust the following settings in `TopHatNotifier.js`:
- `TOPHAT_URL`: Your TopHat course page URL
- `POLL_INTERVAL`: How often to check for new questions (in milliseconds, default: 2000)
