const schema = {
  title: "Maximum call stack",
  description: "Example to reproduce the error.",
  $ref: "#/definitions/Person",
  type: "object",
  definitions: {
    Person: {
      properties: {
        firstName: {
          type: "string",
          title: "First name"
        },
        lastName: {
          type: "string",
          title: "Last name"
        },
        address: {
          title: "Hello",
          type: "array",
          items: {
            $ref: "#/definitions/Address"
          }
        }
      }
    },
    Address: {
      properties: {
        street: {
          type: "string",
          title: "address2"
        },
        resident: {
          type: "object",
          $ref: "#/definitions/Person"
        }
      }
    }
  }
};

const uiSchema = {
  address: {
    "ui:options": {
      foldable: true
    },
    resident: {
      "ui:options": {
        foldable: true
      }
    }
  }
};
export default {
  schema: schema,
  uiSchema: uiSchema,
  formData: {}
};
