# Contributing to GLightbox

Please read these guidelines before contributing code.

## :nut_and_bolt: Setting up the development environment

- Fork and clone the repository
- `npm install`
- `npm run watch` to start the watcher
- The library files can be found inside the `src` folder, open any file and make your changes

## :tada: Proposing a Change

GLightbox was designed to be modular, this means that new functionalities must live in external plugins, if you truly believe that the change must be included in the code please create an issue first explaining your idea and asking whether there's need for such a feature/change. Remember the script's core philosophy is to stay simple and minimal, doing one thing and doing it right.

## :bug: Fixing a Bug

When fixing a bug please make sure to test it in multiple browsers like Chrome, Safari, Firefox to ensure that your code works correctly. Once your code is ready follow the steps mentioned in the **Before you open a Pull Request** section.

## :pencil: Before you open a Pull Request

- Follow the same conding style.
- Use eslint to verify your code, every pull request is verified using eslint
- **DO NOT** commit changes in the dist directory, this files are generated automatically by Github Actions when a new tag it's created.
- Follow Git best practices (especially use meaningful commit messages). Starting from V4, we have adopted [conventional commit specification](https://www.conventionalcommits.org/en/v1.0.0/).
- Describe thoroughly you work in a PR comment.
- Be patient and understanding. It's a side project, done in free time.

Thank you to everyone who has contributed to GLightbox
