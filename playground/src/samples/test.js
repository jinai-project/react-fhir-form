const treeSchema = {
  properties: {},
};
treeSchema.properties.tree = treeSchema;
const rootSchema = {
  definitions: {},
  properties: {
    tree: treeSchema,
  },
  type: "object",
};

module.exports = {
  schema: rootSchema,
  formData: {},
  uiSchema: {},
};
