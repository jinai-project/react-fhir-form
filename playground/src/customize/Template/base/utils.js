/**
 * Created by Tw93 on 2018-09-26.
 * common utils
 */

// clone obj
export function clone(data) {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (e) {
    return data;
  }
}

// '3' => true, 3 => true, undefined => false
export function isLooselyNumber(num) {
  if (typeof num === "number") {
    return true;
  }
  if (typeof num === "string") {
    return !Number.isNaN(Number(num));
  }
  return false;
}

export function isCssLength(str) {
  if (typeof str !== "string") {
    return false;
  }
  return str.match(/^([0-9])*(%|px|rem|em)$/i);
}

export function isDeepEqual(param1, param2) {
  if (param1 === undefined && param2 === undefined) {
    return true;
  } else if (param1 === undefined || param2 === undefined) {
    return false;
  } else if (param1.constructor !== param2.constructor) {
    return false;
  }

  if (param1.constructor === Array) {
    if (param1.length !== param2.length) {
      return false;
    }
    for (let i = 0; i < param1.length; i++) {
      if (param1[i].constructor === Array || param1[i].constructor === Object) {
        if (!isDeepEqual(param1[i], param2[i])) {
          return false;
        }
      } else if (param1[i] !== param2[i]) {
        return false;
      }
    }
  } else if (param1.constructor === Object) {
    if (Object.keys(param1).length !== Object.keys(param2).length) {
      return false;
    }
    for (let i = 0; i < Object.keys(param1).length; i++) {
      const key = Object.keys(param1)[i];
      if (
        param1[key] &&
        typeof param1[key] !== "number" &&
        (param1[key].constructor === Array ||
          param1[key].constructor === Object)
      ) {
        if (!isDeepEqual(param1[key], param2[key])) {
          return false;
        }
      } else if (param1[key] !== param2[key]) {
        return false;
      }
    }
  } else if (param1.constructor === String || param1.constructor === Number) {
    return param1 === param2;
  }
  return true;
}

export function getFormat(format) {
  let dateFormat;
  switch (format) {
    case "date":
      dateFormat = "YYYY-MM-DD";
      break;
    case "time":
      dateFormat = "HH:mm:ss";
      break;
    case "dateTime":
      dateFormat = "YYYY-MM-DD HH:mm:ss";
      break;
    default:
      dateFormat = "YYYY-MM-DD";
      if (format && typeof format === "string") {
        dateFormat = format;
      }
  }
  return dateFormat;
}

export function hasRepeat(list) {
  return list.find(
    (x, i, self) =>
      i !== self.findIndex(y => JSON.stringify(x) === JSON.stringify(y))
  );
}

// ----------------- schema about

// combine schema and uiSchema
export function combineSchema(propsSchema, uiSchema) {
  const propList = getChildren(propsSchema);
  const newList = propList.map(p => {
    const { name } = p;
    const { type, enum: options, properties, items } = p.schema;
    const isObj = type === "object" && properties;
    const isArr = type === "array" && items && !options; // enum + array means multiselect, has no sub
    const ui = name && uiSchema[p.name];
    if (!ui) {
      return p;
    }
    // if is list, combine items recursively
    if (isArr) {
      const newItems = combineSchema(items, ui.items || {});
      return { ...p, schema: { ...p.schema, ...ui, items: newItems } };
    }
    // object, combine whole schema recursively
    if (isObj) {
      const newSchema = combineSchema(p.schema, ui);
      return { ...p, schema: newSchema };
    }
    return { ...p, schema: { ...p.schema, ...ui } };
  });

  const newObj = {};
  newList.forEach(s => {
    newObj[s.name] = s.schema;
  });

  const topLevelUi = {};
  Object.keys(uiSchema).forEach(key => {
    if (typeof key === "string" && key.substring(0, 3) === "ui:") {
      topLevelUi[key] = uiSchema[key];
    }
  });
  if (isEmpty(newObj)) {
    return { ...propsSchema, ...topLevelUi };
  }
  return { ...propsSchema, ...topLevelUi, properties: newObj };
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// get children of schema
function getChildren(schema) {
  const {
    // object
    properties,
    // array
    items,
    type
  } = schema;
  if (!properties && !items) {
    return [];
  }
  let schemaSubs = {};
  if (type === "object") {
    schemaSubs = properties;
  }
  if (type === "array") {
    schemaSubs = items;
  }
  return Object.keys(schemaSubs).map(name => ({
    schema: schemaSubs[name],
    name
  }));
}

// combine multiple schema tree
export function combine() {}

export const isValidVariableName = param => /^[a-zA-Z]+$/g.test(param);

// Remove all window valid api
// For safety jest-* variable will throw error
export function safeEval(code) {
  let safeContextStr = "";
  if (typeof window !== "undefined") {
    const windowContextAttr = Object.getOwnPropertyNames(window).filter(
      isValidVariableName
    );
    for (let i = 0, len = windowContextAttr.length; i < len; i++) {
      safeContextStr += `var ${windowContextAttr[i]} = undefined;`;
    }
  }
  return Function(`${safeContextStr} "use strict";  ${code}`)();
}
// alternative of eval
export const parseString = string => safeEval(`return (${string})`);

export const evaluateString = (string, formData, rootValue) =>
  safeEval(`
  const rootValue =${JSON.stringify(rootValue)};
  const formData = ${JSON.stringify(formData)};
  return (${string})
  `);

// if schema value is function
// JSON can't use function, we use "{{...}}" to mark, or@ which is not recommended。
export function isFunction(func) {
  if (typeof func === "function") {
    return true;
  }
  if (typeof func === "string" && func.substring(0, 1) === "@") {
    return func.substring(1);
  }
  if (
    typeof func === "string" &&
    func.substring(0, 2) === "{{" &&
    func.substring(func.length - 2, func.length) === "}}"
  ) {
    return func.substring(2, func.length - 2);
  }
  return false;
}

// if there is a function in schema
export function isFunctionSchema(schema) {
  return Object.keys(schema).some(key => {
    if (typeof schema[key] === "function") {
      return true;
    } else if (typeof schema[key] === "string") {
      return isFunction(schema[key]);
    } else if (typeof schema[key] === "object") {
      return isFunctionSchema(schema[key]);
    } else {
      return false;
    }
  });
}

function stringContains(str, text) {
  return str.indexOf(text) > -1;
}

export const isObj = a =>
  stringContains(Object.prototype.toString.call(a), "Object");
