import fhirschema from "../fhir_schema/4.0.1/fhir.schema";
let practitioner = fhirschema.definitions.Practitioner;

practitioner.title = "Practitioner";
practitioner.type = "object";

practitioner.definitions = fhirschema.definitions;
delete practitioner.definitions.Practitioner;
const formData = {
  resourceType: "Practitioner",
  id: "example",
  text: {
    status: "generated",
    div:
      '<div xmlns="http://www.w3.org/1999/xhtml">\n      <p>Dr Adam Careful is a Referring Practitioner for Acme Hospital from 1-Jan 2012 to 31-Mar\n        2012</p>\n    </div>'
  },
  identifier: [
    {
      system: "http://www.acme.org/practitioners",
      value: "23"
    }
  ],
  active: true,
  name: [
    {
      family: "Careful",
      given: ["Adam"],
      prefix: ["Dr"]
    }
  ],
  address: [
    {
      use: "home",
      line: ["534 Erewhon St"],
      city: "PleasantVille",
      state: "Vic",
      postalCode: "3999"
    }
  ],
  qualification: [
    {
      identifier: [
        {
          system: "http://example.org/UniversityIdentifier",
          value: "12345"
        }
      ],
      code: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v2-0360/2.7",
            code: "BS",
            display: "Bachelor of Science"
          }
        ],
        text: "Bachelor of Science"
      },
      period: {
        start: "1995"
      },
      issuer: {
        display: "Example University"
      }
    }
  ]
};
export default {
  schema: practitioner,
  uiSchema: {},
  formData: formData
};
