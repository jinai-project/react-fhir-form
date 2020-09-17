import fhirschema from "../fhir_schema/4.0.1/fhir.schema";
let organization = fhirschema.definitions.Organization;

organization.title = "Organization";
organization.type = "object";

organization.definitions = fhirschema.definitions;
delete organization.definitions.Organization;
const formData = {
  resourceType: "Organization",
  id: "1",
  text: {
    status: "generated",
    div:
      '<div xmlns="http://www.w3.org/1999/xhtml">\n      \n      <p>Gastroenterology @ Acme Hospital. ph: +1 555 234 3523, email: \n        <a href="mailto:gastro@acme.org">gastro@acme.org</a>\n      </p>\n    \n    </div>'
  },
  identifier: [
    {
      system: "http://www.acme.org.au/units",
      value: "Gastro"
    }
  ],
  name: "Gastroenterology",
  telecom: [
    {
      system: "phone",
      value: "+1 555 234 3523",
      use: "mobile"
    },
    {
      system: "email",
      value: "gastro@acme.org",
      use: "work"
    }
  ]
};
export default {
  schema: organization,
  uiSchema: {},
  formData: formData
};