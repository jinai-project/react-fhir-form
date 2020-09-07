module.exports = {
  schema: {
    title: "A list of tasks",
    type: "object",
    required: ["title"],
    properties: {
      title: {
        type: "string",
        title: "Task list title"
      },
      tasks: {
        type: "array",
        title: "Tasks",
        items: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              title: "Title",
              description: "A sample title"
            },
            details: {
              type: "string",
              title: "Task details",
              description: "Enter the task details"
            },
            done: {
              type: "boolean",
              title: "Done?",
              default: false
            }
          }
        }
      }
    }
  },
  uiSchema: {
    "ui:options": {
      foldable: true
    },
    tasks: {
      items: {
        details: {
          "ui:widget": "textarea"
        }
      }
    }
  },
  formData: {
    title: "My current tasks"
  }
};
