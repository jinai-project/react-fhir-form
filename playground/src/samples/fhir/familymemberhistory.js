import fhirschema from "../fhir_schema/4.0.1/fhir.schema";
let familymemberhistory = fhirschema.definitions.FamilyMemberHistory;

familymemberhistory.title = "FamilyMemberHistory";
familymemberhistory.type = "object";

familymemberhistory.definitions = fhirschema.definitions;
delete familymemberhistory.definitions.FamilyMemberHistory;
const formData = {
  resourceType: "FamilyMemberHistory",
  id: "father",
  text: {
    status: "generated",
    div:
      '<div xmlns="http://www.w3.org/1999/xhtml">Father died of a heart attack aged 74</div>'
  },
  identifier: [
    {
      value: "12345"
    }
  ],
  instantiatesUri: ["http://example.org/family-member-history-questionnaire"],
  status: "completed",
  patient: {
    reference: "Patient/example",
    display: "Peter Patient"
  },
  date: "2011-03-18",
  relationship: {
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
        code: "FTH",
        display: "father"
      }
    ]
  },
  sex: {
    coding: [
      {
        system: "http://hl7.org/fhir/administrative-gender",
        code: "male",
        display: "Male"
      }
    ]
  },
  condition: [
    {
      code: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "315619001",
            display: "Myocardial Infarction"
          }
        ],
        text: "Heart Attack"
      },
      contributedToDeath: true,
      onsetAge: {
        value: 74,
        unit: "yr",
        system: "http://unitsofmeasure.org",
        code: "a"
      },
      note: [
        {
          text:
            "Was fishing at the time. At least he went doing someting he loved."
        }
      ]
    }
  ]
};
export default {
  schema: familymemberhistory,
  uiSchema: {},
  formData: formData
};
