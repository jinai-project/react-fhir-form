import fhirschema from "../fhir_schema/4.0.1/fhir.schema";
let valueset = fhirschema.definitions.ValueSet;

valueset.title = "ValueSet";
valueset.type = "object";
// for (let propertyName in valueset.properties) {
//   // console.log(propertyName)
//   if (propertyName[0] != 'a') {
//     delete valueset.properties[propertyName]
//   }
// }
// console.log(valueset);
valueset.definitions = fhirschema.definitions;
delete valueset.definitions.ValueSet;
export default {
  schema: valueset,
  uiSchema: {},
  formData: {}
};
