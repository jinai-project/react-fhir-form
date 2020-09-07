
# react-fhir-form

[![GitHub last commit](https://img.shields.io/github/last-commit/alibaba/form-render.svg?style=flat-square)](https://github.com/alibaba/form-render/commits/dev)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/alibaba/form-render.svg?style=flat-square)](https://github.com/alibaba/form-render/issues?utf8=%E2%9C%93&q=)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)
[![Contributors][contributors-shield]][contributors-url]
[![Apache 2.0 License][license-shield]][license-url]

 a form for FHIR built on react-jsonschema-form



- [Introduction](docs/Introduction.md)
- <a href="/_demos/index" target="_blank">Playground</a> / <a href="https://codesandbox.io/s/form-renderjichudemo-8k1l5" target="_blank">Code Sandbox</a>
- [Usedby](docs/Usedby.md)
- <a href="https://github.com/jinai-project/react-fhir-form/projects/1" target="_blank">Roadmap</a>

## Getting Started

```shell
cd playground
npm install
npm start
```

## API

below are some new APIs

### foldable
Controls whether an array or object can be fold
 - note: the $ref field is always added a foldable by default to avoid infinite cyclic referencing.
```
const schema = {type: "object"};
const uiSchema = {
  "ui:options": {
    foldable: true
  }
};
```

## Getting Started

```shell
> git clone https://github.com/jinai-project/react-fhir-form/.git
> cd react-fhir-form/playground
> npm i
> npm start
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

Thank you very much for your contribution！

<a href="https://github.com/jinai-project/react-fhir-form/graphs/contributors">    

## LICENSE

This project is licensed under the Apache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* react-jsonschema-form ([react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form))
* form-render ([form-render](https://github.com/alibaba/form-render))