function getWidgetName(schema, map) {
  const { type, format, enum: enums, readonly } = schema;
  const list = [];
  if (readonly) {
    list.push(`${type}?readonly`);
    list.push("*?readonly");
  }
  if (enums) {
    list.push(`${type}?enum`);
    // array defaults to list，array?enum defaults to checkboxes，*?enum defaults to select
    list.push("*?enum");
  }
  if (format) {
    list.push(`${type}:${format}`);
  }
  list.push(type); // use type default if none match
  let found = "";
  list.some(item => {
    found = map[item];
    return !!found;
  });
  return found;
}

export default function getField(
  schema = {},
  { customized, generated, mapping }
) {
  const { "ui:widget": widget, "ui:field": field } = schema;

  let fieldCanRedefine = false;
  let Field;

  const _widget = typeof widget === "string" ? generated[widget] : widget;
  if (field && !Field) {
    Field = typeof field === "string" ? customized[field] : field;
  }
  if (!Field && _widget) {
    Field = _widget;
  }
  if (!Field && !_widget) {
    Field = generated[getWidgetName(schema, mapping)];
    fieldCanRedefine = !!Field;
  }
  return {
    fieldCanRedefine,
    Field: Field || null
  };
}
