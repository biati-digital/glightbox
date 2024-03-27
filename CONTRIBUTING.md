# Contributing to GLightbox

Please read these guidelines before contributing code.

## Setting up the development environment

Fork and clone the repository and run in the root:

```bash
npm install
```

Type definitions are generated automatically after install, VS Code should be able to find the new files but if it complains about missing types just open the command palette and typ: "TypeScript: Restart TS Server"

## Working on a package

The monorepo contains all the packages related to GLightbox, you can find the code within the `packages` folder. Simply `cd` to the desired package and start the watcher, now every time you make a change your code will be compiled.

```bash
cd packages/glightbox
npm run watch
```

You can also run the watcher at the root level to watch all packages for changes.

**IMPORTANT** do not update package versions. The monorepo uses [Changesets](https://github.com/changesets/changesets) to handle versions and publishing.

## Test your changes

After you've finished making your changes, ensure there are no errors and that your code can build correctly.

```bash
# in the root run this two commands
npm run lint
npm run build
```

## Before you open a Pull Request

- Follow the same conding style.
- Use eslint to verify your code.
- **DO NOT** commit changes in the dist directory, this files are generated automatically by Github Actions.
- Follow Git best practices (especially use meaningful commit messages).
- Add a changeset (If required) specifying the packages you worked with a description
- Describe thoroughly you work in a PR comment.
- Your PR title should follow [conventional commit specification], for example: **fix: custom event not triggered**

## About Changesets

Changesets is a tool to manage versioning and changelogs with a focus on multi-package repositories. To learn more about it please read the [Docs](https://github.com/changesets/changesets)

You can create a changeset running in the root the following command:

```bash
npm run change

# or if you prefer
npx changeset
```

- **Important:** Not all changes require changesets. If the current change is to modify some infrastructure of the repository, such as CI, testing, docs, etc., there is no need to add changesets.
- Multiple changesets can be submitted in one pull request.
- When creating a changeset, all packages related to the feature need to be selected to avoid some packages not being published when releasing.
- When a pull request has multiple features or bug fixes, multiple npm run change commands can be executed to add multiple changeset files. Each file selects the corresponding packages for the feature and adds change information.

Thank you to everyone who has contributed to GLightbox
