# Frontend

## Setup

Welcome! Before you get coding, there's a few setup-related tasks to complete. Specifically, you'll have to **1) install necessary development tools**, **2) configure your workflow**, and **3) fork the repo**. After that, you should be able to get up and running.

### 0) Upgrade your machine, package managers

Make sure your computer is up to date! For MacOS/Linux, we highly recommend installing packages with [Homebrew](https://brew.sh/)

### 1) Devtools

The first step is making sure your computer has the necessary development software to run iOS and Android simulators.

#### brew (MacOS/Linux only)

Make sure `yarn` is installed

`brew install yarn`

Make sure `cocoapods` is installed

`brew install cocoapods`

Follow the instructions on React Native's docs [here](https://reactnative.dev/docs/environment-setup) under "React Native CLI Quickstart", being sure to follow directions for _your operating system_, for _both target operating systems_ (iOS and Android). **Skip the step about installing cocoapods, as you already installed it**. Stop upon reaching the section "Creating a new application", as our project already exists.

Windows users wishing to develop on iOS will have spin up a virtual Mac (through something like VirtualBox, free, or VMWare Workstation, paid). An alternative solution is to build a "Hackintosh". Unfortunately, none of these solutions are particularly ideal. If this is a major concern, please voice it to the team!

Now that you've forked your repo and installed your developer tools, you are ready to build and run your project!

### 1) Git going

You'll need to fork the Frontend repo and sync it upstream.

_To fork the repo_, simply click the "Fork" button near the top right of this page. If prompted to select "where" to fork it, click your username.

_To clone your forked repo_ to your local file system, first, navigate to the forked repo in your browser (**not** the original repository). Click the large green "Clone" button, and copy the URL onto your clipboard. Then, in a terminal window, navigate to where you want the project to live on your local file system (my recommendation is in a directory named "tagg" where you can store both your frontend & backend projects), and run the following command, replacing the dummy URL with your clipboard contents:

`git clone https://github.com/your-username/Frontend.git`

You'll be prompted for your GitHub username & password, which you should enter. If, when working with GitHub in the future, you don't want to enter your credentials each time, check out [this guide](https://help.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh).

Now you have a local copy of your forked project on your computer, but it's not yet synced with the original repository. To sync your fork upstream, navigate to your repository in a terminal window. Inside the project directory, run the command

`git remote add upstream https://github.com/TaggiD-Inc/Frontend.git`

Double check that this succeeded by running

`git remote -v`

in your project directory. If this worked, in addition to the two "origin" remotes, you should see two more "upstream" remotes.

If you've made it here with no errors, congratulations! You now have a local copy of the project. If you had any problems, feel free to consult your teammates.

### 2) Workflow

Next, you'll learn how to pull updates from the main repository, install dependencies, and configure your local git settings.

In order to pull updates from the main repository into to your local project, navigate to your local project and run the command

`git pull upstream master`

Your local project will then have the up-to-date project code from the main repository, but your fork on GitHub ("origin") will be now outdated. To push these local updates to your forked repository's master branch, run the command

`git push origin master`

In order to build your project in Xcode and Android Studio, your project dependencies, like those in `node_modules/` and `ios/Pods/`, need to be installed. These dependencies are not uploaded to GitHub, so you'll need to navigate into your project directory and run (ensuring that yarn and cocoapods are installed).

`yarn`

which will install your node dependencies, then, navigating into the `ios/` directory.

`pod install`

which will install your cocoapods dependencies. Make sure to perform these two steps each time you pull from upstream, as dependencies may be added and removed throughout the course of the project.

To work on a new feature, checkout a new branch in your local project with the command

`git checkout -b tmaXX-name-of-feature`

where "tmaXX-name-of-feature" refers to the Jira ticket number and feature name (e.g. tma1-setup-mysql-ec2).

To push your changes on your feature branch to your fork, run the command

`git push origin tmaXX-name-of-feature`

The first time you push a local feature branch to your fork, run the above command with the `-u` flag (e.g. `git push -u origin tmaXX-name-of-feature`). This sets up the upstream branch. Detailed instructions can be found [here](https://devconnected.com/how-to-push-git-branch-to-remote/).

To ensure your local feature branch is up-to-date with the main repository, run this command from your local branch

`git pull upstream master`

To view your branches and see which one you're currently on, run

`git branch` (exit that view with `q`)

To switch branches, run

`git checkout branch-name` (e.g. `git checkout master`)

Once you finish building and testing a feature with the most up-to-date project code from the main repository, commit and push your local updates to your GitHub fork, then merge the _feature branch_ of your forked repository into the _master branch_ of the main repository through a GitHub pull request. This can be done in a browser by navigating to your forked repository and the branch to merge on GitHub.

Lastly, your commits need to be signed. We'll be using GPG keys for signing commits. You may have `gpg` already installed on your shell, but instead we will use `gpg2`. Run `brew uninstall gpg` to remove `gpg`. Follow this [guide](https://gist.github.com/troyfontaine/18c9146295168ee9ca2b30c00bd1b41e) to learn how to set up your GPG key, using `gpg2`. **Stop at step 12** and instead run

`git config --global gpg.program gpg2`

Complete the steps through **step 14**. Afterwards, [upload](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-new-gpg-key-to-your-github-account) your key to Github by copy/pasting the PGP public key block from step 11. The GitHub help site doesn't mention it, but there are a few extra items to configure after creating and uploading your key. Specifically, run the commands

- `echo 'export GPG_TTY=$(tty)' >> .bash_profile && source .bash_profile` (replacing `.bash_profile` with your shell's configuration file. If you are on macOS and using zsh, this is `.zshrc`; check your shell with `echo $SHELL`)

Lastly, ensure that you see your full name and GitHub email when running

- `git config --global user.name`
- `git config --global user.email`

If not, set them by simply running the same command but with your name and email as an argument (enclosed in quotes, e.g. `git config --global user.name "FIRST LAST"`).

In the future, all commits made from the command line should be done with the `-S` flag (e.g. `git commit -S -m "commit message"`). This tells git to sign the commit.

If you've made it here, congratulations! You are one step closer to being fully set up. Again, if this is not the case, feel free to consult your teammates.

## Running

To build and run your project, open a terminal window, navigate to your project directory, and run `yarn ios` or `yarn android`. This should prompt Xcode / Android Studio, if they have been properly installed and configured, to launch a mobile simulator, where you'll be able to view your code edits in real time (live reload on save). Happy coding!

## Common Issues

1. When building the Tagg iOS app, and you're using an M1 mac versus Intel mac, you'll sometimes encounter crashed pod installs that need digging diagnostics reports. The crash aborts the install; to fix the build issue, you need to install ruby ffi to programmatically load dynamically linked libraries via:

- `sudo arch -x86_64 gem install ffi`
- `arch -x86_64 pod install`

## Logging in to the Tagg application

When you check out the master branch of this Frontend repo, your cloned application code by default points to the remote dev server http://18.118.96.54/ . You can confirm this by checking Frontend/src/constants/api.ts, where const BASE_URL points to the server endpoint you are reaching. By changing this value, you can point to different servers:

1. http://127.0.0.1:8000/ - Local python server, you need to run your own local version of the Backend repo code, from master branch. This option offers the most flexibility since you have full control of your local server, which is needed when you need to build features on the server side as well. You can use the phone number 425 802 9118 and PIN 1111 to log in to the app.
2. http://18.118.96.54/ - (Default) Remote dev server, you do not need to run any server, and can just use this server for easiest frontend development. You can use the phone number 425 802 9118 and PIN 1111 to log in to the app.
3. https://app-prod2.tagg.id/ - UAT Test server, for testing pre-prod changes with a UAT app build. Not used unless you are unable to use options 1 and 2 above for running your app against a dev server. You need a valid phone number to receive the PIN for login.
4. https://app-prod3.tagg.id/ - Prod server, with actual live users. Please do not use this endpoint for testing.
