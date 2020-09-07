
# react-fhir-form

[![GitHub last commit](https://img.shields.io/github/last-commit/jinai-project/react-fhir-form.svg?style=flat-square)](https://github.com/jinai-project/react-fhir-form/commits/dev)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/jinai-project/react-fhir-form.svg?style=flat-square)](https://github.com/jinai-project/react-fhir-form/issues?utf8=%E2%9C%93&q=)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)
[![Contributors](https://img.shields.io/github/contributors/jinai-project/react-fhir-form.svg)](https://github.com/jinai-project/react-fhir-form/graphs/contributors)
[![Apache 2.0 License](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](https://choosealicense.com/licenses/apache-2.0/)

 a form for FHIR built on react-jsonschema-form



- [Introduction](docs/Introduction.md)
- <a href="https://jinai-project.github.io/react-fhir-form/" target="_blank">Playground</a> / <a href="https://codesandbox.io/s/form-renderjichudemo-8k1l5" target="_blank">Code Sandbox</a>
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

### onChange
A callback when the content of ArrayFieldTemplate got changed. Can be passed to Form component. We can change and set the formData here.
```
let formContext = {
  onChange: (idSchema, value) => {
    console.log(idSchema.$id)
    console.log(value)
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

[contributors](https://github.com/jinai-project/react-fhir-form/graphs/contributors) 

## LICENSE

This project is licensed under the Apache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* react-jsonschema-form ([react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form))
* form-render ([form-render](https://github.com/alibaba/form-render))