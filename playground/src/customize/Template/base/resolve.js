import { clone, isFunction } from './utils';


function getDefaultValue({ default: def, enum: enums = [], type }) {
  const defaultValue = {
    array: [],
    boolean: false,
    integer: '',
    null: null,
    number: '',
    object: {},
    string: '',
    range: null,
  };

  if (isFunction(def)) {
    return defaultValue[type];
  }
  if (isFunction(enums)) {
    if (type === 'array') {
      return [];
    }
    if (type === 'string' || type === 'number') {
      return '';
    }
  }

  // if a default is set, use default
  if (typeof def !== 'undefined') {
    return def;
  }
  // when it's array and enum, which means multiselect, default value[]
  if (type === 'array' && enums.length) {
    return [];
  }
  

  if (Array.isArray(enums) && enums[0] && typeof enums[0] !== 'undefined') {
    return enums[0];
  }
  // use default basic type
  return defaultValue[type];
}

function resolve(schema, data, options = {}) {
  const {

    type,

    properties,

    items,

    default: def,
    required = [],
    'ui:widget': widget,
  } = schema;
  const {

    checkRequired = false,
  } = options;

  const value =
    typeof data === 'undefined' ? getDefaultValue(schema) : clone(data);

  if (type === 'object') {
    // custom widget
    if (widget) {
      if (def && typeof def === 'object') {
        return def;
      }
      return value;
    }
    const subs = properties || {};
    const ret = {};
    Object.keys(subs).forEach(name => {
      const checkAndPass =
        checkRequired && [].concat(required).indexOf(name) !== -1;
      if (!checkRequired || checkAndPass) {
        ret[name] = resolve(subs[name], value[name], options);
      }
    });
    return ret;
  }
  if (type === 'array') {
    // no value and has default, use default
    if (def && Array.isArray(def) && !value) {
      return def;
    }
    // custom widget
    if (widget) return value;

    const subs = [].concat(items || []);
    const ret = [];
    value.forEach &&
      value.forEach((item, idx) => {
        ret[idx] = resolve(subs[idx] || subs[0], item, options);
      });
    return ret;
  }
  return value;
}

export default resolve;
