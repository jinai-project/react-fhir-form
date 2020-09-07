import React from 'react';
import { isHidden } from '../base/isHidden';
import { isFunction } from '../base/utils';

const getEnumValue = (value, enums, enumNames) => {
  if (Array.isArray(enums) && Array.isArray(enumNames)) {
    if (typeof value === 'string' || typeof value === 'number') {
      const count = enums.indexOf(value);
      if (count > -1) {
        return enumNames[count];
      }
      return value;
    } else if (Array.isArray(value)) {
      const result = value.map(v => getEnumValue(value, enums, enumNames));
      return String(result);
    }
    return value;
  }
  return value;
};

export const DescriptionList = ({ schema = {}, value = [], index }) => {
  const list = getDescription({ schema, value, index })
    .filter(item => item.title)
    .slice(0, 3);
  return (
    <ul className="flex overflow-hidden" style={{ paddingRight: 45 }}>
      {list.map((item, i) => {
        return item.title ? (
          <li
            className="overflow-hidden truncate"
            style={{ width: '33%', paddingRight: 8 }}
            key={i}
          >
            <span className="fw5">{item.title}: </span>
            <span className="truncate">{item.text}</span>
          </li>
        ) : null;
      })}
    </ul>
  );
};

// get {title, value} list
export const getDescription = ({ schema = {}, value = [], index }) => {
  const { items = {} } = schema;
  // only when items is object we do fold
  if (items.type !== 'object') {
    return [];
  }
  let titles = (items && items.properties) || {};
  titles = Object.values(titles);
  let description = (value && value.length && value[index]) || {};
  const valueList = Object.values(description);
  const descList = titles.map((t, idx) => {
    let hidden = t && t['ui:hidden'];

    if (typeof hidden === 'string' && isFunction(hidden) === false) {
      hidden = isHidden({ hidden, rootValue: description });
    }
    if (hidden) return;
    const title = t.title;
    let text = valueList[idx];
    if (text === null && text === undefined) {
      text = '';
    } else if (typeof text === 'boolean') {
      text = text ? 'Yes' : 'No';
    } else if (typeof text !== 'string' && typeof text !== 'number' && text) {
      text = '{Structure}';
    } else if (t.enum && t.enumNames) {
      text = getEnumValue(text, t.enum, t.enumNames);
    }
    return {
      title,
      text,
    };
  });
  // remove null
  return descList.filter(d => !!d);
};

export const ObjDescriptionList = ({ schema = {}, value = {} }) => {

  const list = getObjDescription({ schema, value })
    .filter(item => item.title)
    .slice(0, 3);
  return (
    <ul className="flex overflow-hidden" style={{ paddingRight: 45 }}>
      {list.map((item, i) => {
        return item.title ? (
          <li
            className="overflow-hidden truncate"
            style={{ width: '33%', paddingRight: 8 }}
            key={i}
          >
            <span className="fw5">{item.title}: </span>
            <span className="truncate">{item.text}</span>
          </li>
        ) : null;
      })}
    </ul>
  );
};

export const getObjDescription = ({ schema = {}, value = {} }) => {

  let titles = (schema && schema.properties) || {};

  if (value === null) {
    value = {};
  }

  const descList = Object.keys(titles).map(k => {
    let t = titles[k]
    let hidden = t && t['ui:hidden'];
    // TODO: move outside
    if (typeof hidden === 'string' && isFunction(hidden) === false) {
      hidden = isHidden({ hidden, rootValue: value });
    }
    if (hidden) return;
    const title = t.title || k;
    let text = value[k];
    if (text === null || text === undefined) {
      text = '';
    } else if (typeof text === 'boolean') {
      text = text ? 'Yes' : 'No';
    } else if (typeof text !== 'string' && typeof text !== 'number' && text) {
      text = '{Structure}';
    } else if (t.enum && t.enumNames) {
      text = getEnumValue(text, t.enum, t.enumNames);
    }
    return {
      title,
      text,
    };
  });
  // remove null
  return descList.filter(d => !!d);
};