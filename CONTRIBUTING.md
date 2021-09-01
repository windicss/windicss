# Contributing to windicss

Thanks for your interest in contributing! Please read carefully through our guidelines below to ensure that your contribution adheres to our project's standards.

## Issue Tracking

We use [GitHub Issues](https://github.com/voorjaar/windicss/issues) to track all tasks related to this project.

## Build the project locally

In order to contribute to windicss, you must first get a copy of the project running locally on your computer.

There are five steps to building this project:

1. [Set up Git and Install Node.js](#set-up-git-and-install-nodejs)
2. [Fork the repository](#fork-the-repository)
3. [Clone your fork](#clone-your-fork)
4. [Install dependencies](#install-dependencies)
5. [Build the project](#build-the-project)

### Set up Git and Install Node.js

All GitHub projects are backed by a version control software called _Git_. You'll need to [set up Git](https://github.com/danthareja/contribute-to-open-source/wiki/Setting-up-Git) in order to contribute to _any_ project on GitHub.

This specific project is written in JavaScript and uses Node.js as it's runtime. You'll need to [install Node.js](https://nodejs.org/en/) in order to run the project.

### Fork the [repository](https://github.com/voorjaar/windicss.git)

A _fork_ is a copy of a repository. Forking a repository lets you to make changes to your copy without affecting any of the original code.

Click **Fork** (in the top-right corner of the page) to copy this repository to your GitHub account.

### Clone your fork

Use git to clone your fork to your computer.

```bash
git clone https://github.com/${username}/windicss.git
```

### Install dependencies

This project uses [pnpm](https://pnpm.js.org/), a command-line tool bundled with Node.js, to maintain third-party dependencies.

First, navigate into the project's directory

```bash
cd windicss
```

Next, use `pnpm` to install the project' dependencies

```bash
pnpm install
```

### Build the project

Development Version

```bash
pnpm build
```

Production Version

```bash
pnpm build:prod
```

## Submit a Pull Request

After you successfully [build the project](#build-the-project), you can make some changes of your own.

There are five steps to submit pull request:

1. [Create a new branch](#create-a-new-branch)
2. [Make your changes](#make-your-changes)
3. [Test your changes](#test-your-changes)
4. [Push your changes](#push-your-changes)
5. [Open a Pull Request](#open-a-pull-request)

### Create a new branch

```bash
git branch fix-issue-123
git checkout fix-issue-123
```

### Make your changes

Make sure your code is following [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html).

Lint your code:

```bash
pnpm lint
```

### Test your changes

You should add a new test file for your changes into [test](/tree/main/test) folder, the file should has extension `.test.ts`.

Run tests:

```bash
pnpm test
```

Generate coverage report:

```bash
pnpm coverage
```

### Test changes in a real project

To test the changes you made, you can use the [`playground`](./playground)
project.

1. In the windicss root project directory, run:

    ```bash
    pnpm install
    ```

2. In the first terminal, run `pnpm dev` in the windicss project directory, and in the
   second one open the playground directory and run `pnpm dev`.

    This would set up a watcher that would rebuild the `windi.css` file in the `playground`
    directory every time you make a change in the windicss source code. You would need
    something like [Live
    Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) to
    see your changes in the browser.

#### Development

Open two editors, one with the windicss repo, one with your actual project.

### Push your changes

```bash
git add .
git commit -m "fix issue 123"
git push origin fix-issue-123
```

### Open a Pull Request

1. Find the [New Pull Request](https://github.com/voorjaar/windicss/compare) button
2. Select the option to **compare across forks**
3. Select **your fork**(${username}/windicss) in the `head repository` option
4. Select **your branch** in the `compare` option
5. Click **Create Pull Request**

## License

By contributing, you agree that your contributions will be licensed under its [MIT license](https://github.com/voorjaar/windicss/blob/main/LICENSE).
