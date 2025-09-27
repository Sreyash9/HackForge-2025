# HackForge 2025 Projects Repository 🚀

Welcome to the central repository for **HackForge 2025**! This is where all participating teams can upload and showcase their amazing projects built during the event.

## 📁 Repository Structure

Each team should create their own folder following this structure:

```
hackforge-2025-projects/
│
├── team-alpha/
│   └── project-name/
│       ├── README.md
│       ├── src/
│       └── ...
│
├── team-beta/
│   └── project-name/
│       ├── README.md
│       ├── src/
│       └── ...
│
└── team-gamma/
    └── project-name/
        ├── README.md
        ├── src/
        └── ...
```

## 🎯 How to Add Your Project

### Option 1: Fork & Pull Request (Recommended)

1. **Fork this repository** by clicking the "Fork" button at the top right
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/Sreyash9/HackForge-2025.git
   ```
3. **Create a new branch** for your team:
   ```bash
   git checkout -b add/your-team-name-project
   ```
4. **Create your team folder** and add your project:
   ```bash
   mkdir -p your-team-name/your-project-name
   # Copy your project files into the folder
   
   ```
5. **Commit and push** your changes:
   ```bash
   git add .
   git commit -m "Add [Your Team Name] - [Project Name]"
   git push origin add/your-team-name-project
   ```
6. **Create a Pull Request** from your fork to this main repository

### Option 2: Direct Upload (GitHub Web Interface)

1. Navigate to this repository on GitHub
2. Click **"Add file" → "Upload files"**
3. Create your folder structure by typing: `your-team-name/your-project-name/filename.ext`
4. Upload your project files
5. Choose **"Create a new branch"** and submit as a Pull Request

### Option 3: GitHub Desktop

1. Clone this repository using GitHub Desktop
2. Create a new branch
3. Add your project files in the appropriate folder structure
4. Commit changes and create a Pull Request

## 📋 Project Requirements

### Folder Structure
- **Team Folder**: `your-team-name/`
- **Project Folder**: `your-team-name/your-project-name/`
- **Required Files**: Include a `README.md` in your project folder

### Required README.md Template
Each project should include a `README.md` file with the following information:

```markdown
# [Project Name]

## 🎯 Description
Brief 1-2 sentence description of what your project does.

## ✨ Features
- Feature 1
- Feature 2
- Feature 3

## 🛠️ Technologies Used
- Technology 1
- Technology 2
- Technology 3

## 🚀 How to Run
1. Clone this repository
2. Navigate to the project folder
3. Install dependencies: `[command]`
4. Run the project: `[command]`
5. Access at: `[URL/instructions]`

## 👥 Team Members
- **Name 1** - [@github-username](https://github.com/username) - Role
- **Name 2** - [@github-username](https://github.com/username) - Role
- **Name 3** - [@github-username](https://github.com/username) - Role

```

## ⚠️ Important Guidelines

### Do's ✅
- Use clear, descriptive folder and file names
- Include a comprehensive README.md for your project
- Add screenshots or demo links if possible
- Keep your project self-contained within your team folder
- Use `.gitignore` to exclude large files and build artifacts

### Don'ts ❌
- Don't modify other teams' folders
- Don't commit large files (>100MB) - use Git LFS if needed
- Don't include `node_modules`, `.venv`, or other dependency folders
- Don't use spaces in folder names (use hyphens or underscores)
- Don't commit sensitive information (API keys, passwords, etc.)

## 🔧 Git Best Practices

### Commit Message Format
```
Add [Team Name] - [Project Name]: Brief description

Examples:
- Add Team Alpha - Smart Waste Tracker: IoT waste management system
- Update Team Beta - AI Resume Builder: Add PDF export feature
```

### Branch Naming Convention
```
add/team-name-project-name

Examples:
- add/team-alpha-waste-tracker
- add/team-beta-resume-builder
```

## 🆘 Need Help?

### Common Issues & Solutions

**Problem**: "Permission denied" when pushing
- **Solution**: Make sure you're pushing to your fork, not the main repository

**Problem**: "File too large" error
- **Solution**: Remove large files and add them to `.gitignore`

**Problem**: Merge conflicts
- **Solution**: Pull the latest changes from main branch and resolve conflicts

**Problem**: Can't find your team's folder
- **Solution**: Make sure you're in the correct directory and the folder name matches exactly

**Happy Hacking! 🎉**

*Good luck to all participating teams! We can't wait to see your innovative solutions.*
