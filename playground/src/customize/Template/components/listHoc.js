/**
 * Created by Tw93 on 2019-12-01.
 * listItemHoc
 */

import React from "react";
import PropTypes from "prop-types";
import {
  SortableContainer,
  SortableHandle,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";
import { isFunction, evaluateString } from "../base/utils";
import FoldIcon from "./foldIcon";
import { DescriptionList, getDescription } from "./descList";

const DragHandle = SortableHandle(() => (
  <span className="fr-move-icon">:::</span>
));

const listItemHoc = ButtonComponent =>
  class extends React.Component {
    componentDidMount() {
      const { p = {}, name, fold } = this.props;

      const description = getDescription({
        schema: p.schema,
        value: p.value,
        index: name
      });
      // if first value is not null we fold
      // new value is 0, unfold
      const hasValue = description && description[0] && description[0].text;
      if (hasValue && fold !== 0) {
        this.props.toggleFoldItem(name);
      }
    }

    toggleFold = () => {
      this.props.toggleFoldItem(this.props.name);
    };

    handleDelete = () => {
      const { p = {}, name } = this.props;
      const value = [...p.value];
      value.splice(name, 1);
      p.onChange(p.idSchema, value);
    };

    render() {
      const { item, p = {}, name, fold } = this.props;
      const descProps = { ...p, index: name };
      const { options = {}, readonly, formData, value: rootValue } = p;
      const { foldable: canFold, hideIndex } = options;
      let { removable = true, orderable = true, itemButtons } = options;

      // if removable is a function, eval the value
      let _isFunction = isFunction(removable);
      if (_isFunction) {
        // isFunction returns true because of string | Function
        if (typeof _isFunction === "string") {
          removable = evaluateString(_isFunction, formData, rootValue);
        } else if (typeof _isFunction === "function") {
          removable = _isFunction(formData, rootValue);
        }
      }

      // only if items is object we do fold
      const isObj = p.schema.items && p.schema.items.type == "object";
      let setClass =
        "fr-set ba b--black-10 hover-b--black-20 relative flex flex-column";
      if (canFold && fold) {
        setClass += " pv12";
      } else if (p.displayType === "row") {
        setClass += " pt44";
      }

      return (
        <li className={setClass}>
          {hideIndex ? null : (
            <div
              className="absolute top-0 left-0 bg-blue"
              style={{
                paddingLeft: 4,
                paddingRight: 6,
                borderBottomRightRadius: 8,
                borderTopLeftRadius: 3,
                backgroundColor: "rgba(0, 0, 0, .36)",
                fontSize: 8,
                color: "#fff"
              }}
            >
              {name + 1}
            </div>
          )}

          {canFold && fold && isObj ? <DescriptionList {...descProps} /> : item}
          {canFold && (
            <FoldIcon
              fold={fold}
              onClick={this.toggleFold}
              style={{ position: "absolute", top: 12, right: 32 }}
            />
          )}
          {!readonly && orderable && <DragHandle />}
          {!((canFold && fold) || !removable || readonly) && (
            <div className="self-end flex">
              <ButtonComponent
                type="dashed"
                icon="delete"
                onClick={this.handleDelete}
              >
                Delete
              </ButtonComponent>
              {itemButtons &&
                itemButtons.length > 0 &&
                itemButtons.map((btn, idx) => {
                  return (
                    <ButtonComponent
                      key={idx.toString()}
                      className="ml2"
                      type="dashed"
                      icon={btn.icon}
                      onClick={() => {
                        const value = [...p.value];
                        if (typeof window[btn.callback] === "function") {
                          const result = window[btn.callback](value, name); // eslint-disable-line
                          p.onChange(p.idSchema, result);
                        }
                      }}
                    >
                      {btn.text || ""}
                    </ButtonComponent>
                  );
                })}
            </div>
          )}
        </li>
      );
    }
  };

const fieldListHoc = ButtonComponent => {
  const SortableItem = SortableElement(listItemHoc(ButtonComponent));
  return class extends React.Component {
    handleAddClick = () => {
      const { p, addUnfoldItem } = this.props;
      const value = [...p.value];
      value.push(p.newItem || {});
      p.onChange(p.idSchema, value);
      addUnfoldItem();
    };
    // buttons is a list, each item looks like:
    // {
    //   "text": "clearAll",
    //   "icon": "delete",
    //   "callback": "clearAll"
    // }

    render() {
      const { p, foldList = [], toggleFoldItem } = this.props;
      const { options, extraButtons } = p || {};
      const buttons = options.buttons || extraButtons || [];
      const { readonly, schema = {} } = p;
      const { maxItems } = schema;
      let { addable = true } = options;
      const list = p.value || [];
      if (!Array.isArray(list)) {
        console.error(`"${p.name}"'s schema is wrong, please check`);
        return null;
      }
      const canAdd = maxItems ? maxItems > list.length : true; // hide add button when we reach max
      return (
        <ul className="pl0 ma0">
          {list.map((_, name) => (
            <SortableItem
              key={`item-${name}`}
              index={name}
              name={name}
              p={p}
              fold={foldList[name]}
              toggleFoldItem={toggleFoldItem}
              item={p.arrayGetSubField({
                name,
                value: p.value[name],
                onChange(key, val) {
                  const value = [...p.value];
                  value[key] = val;
                  p.onChange(p.idSchema, value);
                }
              })}
            />
          ))}
          {!readonly && (
            <div className="tr mb2">
              {canAdd && addable && (
                <ButtonComponent icon="add" onClick={this.handleAddClick}>
                  Add
                </ButtonComponent>
              )}
              {buttons &&
                buttons.length > 0 &&
                buttons.map((item, i) => {
                  const { icon, text, callback, ...rest } = item;
                  return (
                    <ButtonComponent
                      className="ml2"
                      icon={icon}
                      key={i.toString()}
                      onClick={() => {
                        if (callback === "clearAll") {
                          p.onChange(p.idSchema, []);
                          return;
                        }
                        if (callback === "copyLast") {
                          const value = [...p.value];
                          const lastIndex = value.length - 1;
                          value.push(
                            lastIndex > -1 ? value[lastIndex] : p.newItem
                          );
                          p.onChange(p.idSchema, value);
                          return;
                        }
                        if (typeof window[callback] === "function") {
                          const value = [...p.value];
                          const onChange = value =>
                            p.onChange(p.idSchema, value);
                          window[callback](value, onChange, schema, p.newItem); // eslint-disable-line
                        }
                      }}
                      {...rest}
                    >
                      {text}
                    </ButtonComponent>
                  );
                })}
            </div>
          )}
        </ul>
      );
    }
  };
};

export default function listHoc(ButtonComponent) {
  const SortableList = SortableContainer(fieldListHoc(ButtonComponent));
  return class extends React.Component {
    static propTypes = {
      value: PropTypes.array
    };

    static defaultProps = {
      value: []
    };

    constructor(props) {
      super(props);

      const len = this.props.value.length || 0;
      this.state = {
        foldList: new Array(len).fill(false) || []
      };
    }

    // new item defaults to unfold
    addUnfoldItem = () =>
      this.setState({
        foldList: [...this.state.foldList, 0]
      });

    toggleFoldItem = index => {
      const { foldList = [] } = this.state;
      foldList[index] = !foldList[index]; // TODO: need better solution for the weird behavior caused by setState being async
      this.setState({
        foldList
      });
    };

    handleSort = ({ oldIndex, newIndex }) => {
      const { onChange, idSchema, value } = this.props;
      onChange(idSchema, arrayMove(value, oldIndex, newIndex));
      this.setState({
        foldList: arrayMove(this.state.foldList, oldIndex, newIndex)
      });
    };

    render() {
      const { foldList } = this.state;
      return (
        <SortableList
          p={this.props}
          foldList={foldList}
          toggleFoldItem={this.toggleFoldItem}
          addUnfoldItem={this.addUnfoldItem}
          distance={6}
          useDragHandle
          helperClass="fr-sort-help-class"
          shouldCancelStart={e =>
            e.toElement && e.toElement.className === "fr-tooltip-container"
          }
          onSortEnd={this.handleSort}
        />
      );
    }
  };
}
