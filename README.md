# my website project: technical and personal challange
**Planned features:**
- [ ] Responsive design
- [ ] Contact form
- [ ] Portfolio section
- [ ] Blog functionality
# git commands Ill need
- git commit -m "Add responsive navigation menu"
- git push origin main
- # See all local branches
- git branch
# See all branches (local + remote from GitHub)
- git branch -a
# See branch history with visual graph
- git log --oneline --graph --all
# Branch Management
git branch                    # List branches
git checkout branch-name      # Switch branches
git checkout -b new-branch    # Create and switch to new branch

# Daily Work
git status                   # See what's changed
git add .                    # Stage changes
git commit -m "message"      # Commit changes
git push origin branch-name  # Push to specific branch

# Merging
git checkout main           # Switch to main
git merge development       # Bring development changes into main

# to know for development
- main branch is working code
- development branch is for active development

# step 1: initial setup: create repository
cd /home/daria/Documents/GitHub/enCORE
git init
git add .
git commit -m "Initial commit: basic website structure"

# step 2: create and switch to development branch
# Create development branch AND switch to it
git checkout -b development

# Step 3: Push Both Branches to GitHub
- # First push development branch
git push -u origin development

- # Now switch back to main and push it too
git checkout main
git push -u origin main

- # Go back to development to continue working
git checkout development # go to sth like directory branch

# connect local repository to GH
 - https://github.com/Dariasels/enCoreWeb.git
 - git remote add origin https://github.com/YOUR_USERNAME/enCORE.git

git push -u origin development

# ubuntu terminal
cd /path/to/project    # Change directory
ls                     # List files
pwd                    # Show current directory
cp file1 file2         # Copy files
mv file1 file2         # Move/rename files
sudo apt update        # Update system packages