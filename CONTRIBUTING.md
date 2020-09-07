# Contributing

First off, thank you for considering contributing to react-fhir-form. Any feature request, optimize suggest or bugfix is welcomed. Let's improve it together.

## Development server

The project use the same directory structure as react-jsonschema-form. When developing, run the following from the playground directory:

```bash
cd playground
npm install
npm start
```

All packages will be live-built, and a live development server showcasing components with hot reload enabled will then run at [localhost:8080](http://localhost:8080).

## Coding style

All the JavaScript code in this project conforms to the [prettier](https://github.com/prettier/prettier) coding style. Code is automatically prettified upon commit using precommit hooks.

### Releasing the playground

In order to publish the latest playground to [https://rjsf-team.github.io/react-jsonschema-form/](https://rjsf-team.github.io/react-jsonschema-form/) after a new rjsf release, run:

```bash
cd packages/playground
npm run publish-to-gh-pages
```
