import React from 'react';
import getField from './getField';
import resolve from './resolve';


// for object and array type
function getSubSchemas(schema = {}) {
  const {
    // object subset
    properties,
    // array subset
    items,
    column,
    // as subset's parent
    ...$parent
  } = schema;
  const { type } = $parent;
  // no subset
  if (!properties && !items) {
    return [];
  }
  let children = {};
  if (type === 'object') {
    children = properties;
  }
  if (type === 'array') {
    children = [].concat(items);
  }
  return Object.keys(children).map(name => ({
    schema: children[name],
    name,
    column,
    // parent propsSchema
    $parent,
  }));
}

const calculateColSpan = (element) => {
  const type = findSchemaType(element);
  const field = findUiSchemaField(element);
  const widget = findUiSchemaWidget(element);

  const defaultColSpan =
    properties.length < 2 || // Single or no field in object.
    type === 'object' ||
    type === 'array' ||
    widget === 'textarea'
      ? 24
      : 12;

  if (_.isObject(colSpan)) {
    return (
      colSpan[widget] || colSpan[field] || colSpan[type] || defaultColSpan
    );
  }
  if (_.isNumber(colSpan)) {
    return colSpan;
  }
  return defaultColSpan;
};

const filterHidden = (element) =>
      element.content.props.uiSchema['ui:widget'] !== 'hidden';

// filter extensions begin with '_'
const filterFhirExtensions = (element) => {
    if (element.content.props.uiSchema['ui:options'] && element.content.props.uiSchema['ui:options'].showExtension == true) {
      return true
    } else {
      if (element.name[0] === '_') {
        return false
      }
    }
    return true
};


export function getBasicProps(settings, materials = {}) {
  const {
    schema,
    uiSchema,
    items,
    properties,
    children,
    name = '',
    $parent = {},
    column,
    displayType,
    showDescIcon,
    showValidate,
    readOnly,
    labelWidth,
    useLogger,
    formData,
    
    disabled,
  } = settings;
  
  if (!schema) return {};
  if (!uiSchema) return {};
  
  const {
    'ui:className': className,
    'ui:options': options = {},
    'ui:hidden': hidden,
    'ui:disabled': _disabled,
    'ui:width': width,
    'ui:readonly': readonly,
    'ui:extraButtons': extraButtons = [],
    'ui:dependShow': dependShow,
    'ui:action': action,
    'ui:labelWidth': _labelWidth,
  } = uiSchema;
  const { required = [] } = $parent;
  // const { generated: widgets, customized: fields } = materials;

  let basicProps = {
    name,
    schema,
    column,
    displayType,
    showDescIcon,
    showValidate,
    options, 
    hidden,
    required: required.indexOf(name) !== -1,
    disabled: _disabled || disabled,
    readonly: readOnly || readonly, 
    labelWidth: _labelWidth || labelWidth,
    useLogger,
    width,
    // widgets,
    // fields,
    formData,
    ...settings
  };
 
  if (dependShow) {
    basicProps = { ...basicProps, dependShow };
  }
  if (className) {
    basicProps = { ...basicProps, className };
  }
  if (action) {
    basicProps = { ...basicProps, action };
  }
  
  const subItems = {};
  const subSchemas = getSubSchemas(schema);
  subSchemas.forEach(subSchema => {
    const { name: _name, schema: _schema = {} } = subSchema;
    subItems[_name] = {
      // field: getField(_schema, materials),
      props: getBasicProps(
        {
          ...subSchema,
          column,
          displayType,
          showDescIcon,
          showValidate,
          readOnly,
          labelWidth: _labelWidth || labelWidth,
          useLogger,
          formData,
          disabled: _disabled || disabled,
        },
        materials
      ),
    };
  });
  // when we read from $ref, schema.type is not present
  if (['array', 'object'].indexOf(schema.type) >= 0 || schema.type === undefined) {
    
    basicProps.arrayGetSubField = o => {
      console.log('arrayGetSubField called')
      // getSchemaData(schema)
      const { field, props, column: c } = subItems[o.name] || subItems[0] || {};
      return (
            <div>
              {items[o.name].children}
            </div>
              );
    };
    basicProps.objGetSubField = o => {
      console.log('objGetSubField called')
      // getSchemaData(schema)
      const { field, props, column: c } = subItems[o.name] || subItems[0] || {};      
      return (
            <div>
            {properties.filter(filterHidden).filter(filterFhirExtensions).map((element) => (
              <div key={element.name}>
                {element.content}
              </div>
            ))}
            </div>
              );
    };
    if (schema.type === 'array' && schema.items) {

      basicProps.extraButtons = extraButtons;

      if (subSchemas && subSchemas[0]) {
        basicProps.newItem = resolve(subSchemas[0].schema);
      }
    }
  }
  return basicProps;
}

/**
 *  schema + materials --> parse --> Field + props
 *  schema {
 *    propsSchema,
 *    uiSchema,
 *    data,
 *    name,
 *  }
 *  materials {
 *    // Field generated by Widget
 *    generated,
 *    // customized Field
 *    customized,
 *    // type mapping to widgetName
 *    mapping,
 *  }
 */
const parse = (settings = {}, materials) => {
  const { schema = {} } = settings;
  return {
    Field: getField(schema, materials).Field,
    props: getBasicProps(settings, materials),
  };
};

export default parse;
