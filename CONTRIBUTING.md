# Contributing to GLightbox.js

Please read these guidelines before contributing code.

## :nut_and_bolt: Setting up the development environment

- Fork and clone the repository
- `npm install`
- `npm run watch`
- To update js and css files, use the `src` folder: src/js/glightbox.js and src/postcss/glightbox.css These files will be compiled automatically with every change to the `dist` folder (do not modify the dist files directly)

## :bug: Fixing a Bug

When fixing a bug please make sure to test it in several browsers including ie11. If you are not able to do so, mention that in a PR comment, so other contributors can do it. once your code is working please run the following command "eslint src/js" to verify that your code is following the same coding standards

## :tada: Proposing a Change

When implementing a feature please create an issue first explaining your idea and asking whether there's need for such a feature. Remember the script's core philosophy is to stay simple and minimal, doing one thing and doing it right.

## :pencil: Before you open a Pull Request

- Follow the same coding style.
- Run eslint to verify your code, run the following command "eslint src/js" and fix any error you find in your code
- **DO NOT** commit changes in the dist directory, this files are created automatically.
- Follow Git best practices (especially use meaningful commit messages).
- Describe thoroughly you work in a PR comment.
- Be patient and understanding. It's a side project, done in free time.

Thank you to everyone who has contributed to GLightbox.js!
