import fhirschema from "../fhir_schema/4.0.1/fhir.schema";
let valueset = fhirschema.definitions.ValueSet;

valueset.title = "valueset";
valueset.type = "object";
// for (let propertyName in valueset.properties) {
//   // console.log(propertyName)
//   if (propertyName[0] != 'a') {
//     delete valueset.properties[propertyName]
//   }
// }
// console.log(valueset);
// valueset.properties = {
//     firstName: {
//         type: "string",
//         title: "First name",
//         default: "Chuck",
//       },
//       lastName: {
//         type: "string",
//         title: "Last name",
//       },
//       // age: {
//       //   type: "integer",
//       //   title: "Age",
//       // },
//       // bio: {
//       //   type: "string",
//       //   title: "Bio",
//       // },
//       // password: {
//       //   type: "string",
//       //   title: "Password",
//       //   minLength: 3,
//       // },
//       telephone: {
//         type: "string",
//         title: "Telephone",
//         minLength: 10,
//       },
// }
valueset.definitions = fhirschema.definitions;
// console.log(valueset);
delete valueset.definitions.ValueSet;
export default {
  schema: valueset,
  uiSchema: {},
  formData: {},
};
