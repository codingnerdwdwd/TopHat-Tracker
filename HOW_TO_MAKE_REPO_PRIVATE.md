# How to Make Your GitHub Repository Private

This repository is currently **public**, which means anyone can view your code. If you want to make it private so that only you (and collaborators you invite) can access it, follow these steps:

## Method 1: Using GitHub Web Interface (Recommended)

1. **Go to your repository on GitHub**: Navigate to https://github.com/codingnerdwdwd/TopHat-Tracker

2. **Access Settings**:
   - Click on the **Settings** tab (located in the top menu bar of your repository)
   - You must be the repository owner to access this option

3. **Change Visibility**:
   - Scroll down to the **Danger Zone** section (at the bottom of the Settings page)
   - Click on **Change repository visibility**
   - Select **Make private**

4. **Confirm the Change**:
   - GitHub will ask you to type the repository name to confirm
   - Type `codingnerdwdwd/TopHat-Tracker` to confirm
   - Click the confirmation button

5. **Done!** Your repository is now private.

## Method 2: Using GitHub CLI

If you have the GitHub CLI installed, you can use:

```bash
gh repo edit codingnerdwdwd/TopHat-Tracker --visibility private
```

## Important Notes

### Free Account Limitations
- ✅ GitHub now allows **unlimited private repositories** for free accounts
- ✅ Private repositories can have unlimited collaborators on free accounts

### What Happens When You Make a Repository Private?

**Public → Private:**
- The repository will no longer appear in search results
- Only you and collaborators you explicitly invite can view or clone the repository
- All existing forks remain public (they are independent copies)
- Stars and watchers are maintained but non-collaborators can no longer access the repo

### Security Considerations for This Repository

Since this is a **TopHat notification tracker** that may contain:
- Your TopHat URLs (which include course-specific information)
- Browser user data directory paths
- Polling configurations

**You should make this repository private** to protect your educational data and personal information.

### After Making the Repository Private

Consider also:
1. **Review commit history**: Check if you've accidentally committed any sensitive data (passwords, tokens, etc.)
2. **Use environment variables**: Store your `TOPHAT_URL` in an environment variable instead of hardcoding it
3. **Add to .gitignore**: Ensure the `tophat-login` directory is in `.gitignore` to prevent committing browser session data

## Need Help?

If you encounter any issues, check GitHub's official documentation:
- [Setting repository visibility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility)
