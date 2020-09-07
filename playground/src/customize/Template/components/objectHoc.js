/**
 * Created by Tw93 on 2019-12-01.
 * listItemHoc
 */

import React from "react";
import PropTypes from "prop-types";
import FoldIcon from "./foldIcon";
import { ObjDescriptionList, getObjDescription } from "./descList";

const objectDetailHoc = ButtonComponent =>
  class extends React.Component {
    componentDidMount() {
      const { p = {}, fold } = this.props;

      const description = getObjDescription({
        schema: p.schema,
        value: p.value
      });

      const hasValue = description && description[0] && description[0].text;
      if (hasValue && fold == true) {
        this.props.toggleFoldItem();
      }
    }

    toggleFold = () => {
      this.props.toggleFoldItem();
    };

    render() {
      const { name, item, p = {}, fold } = this.props;
      const descProps = { ...p };
      const { options = {}, readonly } = p;
      const { foldable: canFold } = options;
      let { itemButtons } = options;

      //add border when it can fold
      let setClass = `fr-set ${
        canFold ? "ba" : ""
      } b--black-10 hover-b--black-20 relative flex flex-column`;
      if (canFold && fold) {
        setClass += " pv12";
      } else if (p.displayType === "row") {
        setClass += " pt44";
      }

      return (
        <div className={setClass}>
          {canFold && fold ? <ObjDescriptionList {...descProps} /> : item}
          {canFold && (
            <FoldIcon
              fold={fold}
              onClick={this.toggleFold}
              style={{ position: "absolute", top: 12, right: 32 }}
            />
          )}
          {!((canFold && fold) || readonly) && (
            <div className="self-end flex">
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
        </div>
      );
    }
  };

const fieldHoc = ButtonComponent => {
  const ObjectDetail = objectDetailHoc(ButtonComponent);
  return class extends React.Component {
    render() {
      const { p, fold = true, toggleFoldItem } = this.props;
      const { options, extraButtons } = p || {};
      const buttons = options.buttons || extraButtons || [];
      const { readonly, schema = {} } = p;
      return (
        <div className="pl0 ma0">
          <ObjectDetail
            p={p}
            fold={fold}
            toggleFoldItem={toggleFoldItem}
            item={p.objGetSubField({
              name: 0,
              value: p.value,
              onChange(key, val) {
                const value = [...p.value];
                value[key] = val;
                p.onChange(p.idSchema, value);
              }
            })}
          />
          {!readonly && (
            <div className="tr mb2">
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
        </div>
      );
    }
  };
};

export default function objectHoc(ButtonComponent) {
  const ObjectField = fieldHoc(ButtonComponent);
  return class extends React.Component {
    static propTypes = {
      value: PropTypes.object
    };

    static defaultProps = {
      value: {}
    };

    constructor(props) {
      super(props);

      this.state = {
        fold: true
      };
    }

    toggleFoldItem = () => {
      let { fold = true } = this.state;
      fold = !fold;
      this.setState({
        fold
      });
    };

    render() {
      const { fold } = this.state;
      return (
        <ObjectField
          p={this.props}
          fold={fold}
          toggleFoldItem={this.toggleFoldItem}
          distance={6}
          useDragHandle
          helperClass="fr-sort-help-class"
          shouldCancelStart={e =>
            e.toElement && e.toElement.className === "fr-tooltip-container"
          }
        />
      );
    }
  };
}
