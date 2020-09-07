import React from "react";
import classNames from "classnames";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import listHoc from "../components/listHoc";
import * as Icons from "@ant-design/icons";
import { Button /*Modal, Drawer*/ } from "antd";
import { getBasicProps } from "../base/parser";

const DESCRIPTION_COL_STYLE = {
  paddingBottom: "8px"
};

function FrButton({ icon, children, ...rest }) {
  let iconName;
  switch (icon) {
    case "add":
      iconName = "PlusCircleOutlined";
      break;
    case "delete":
      iconName = "DeleteOutlined";
      break;
    default:
      iconName = icon;
      break;
  }
  const IconComponent = Icons[iconName];
  if (IconComponent) {
    return (
      <Button {...rest} size="small" icon={<IconComponent />}>
        {children}
      </Button>
    );
  }
  return (
    <Button {...rest} size="small">
      {children}
    </Button>
  );
}

const List = listHoc(FrButton);

const ListWithModal = props => {
  props = getBasicProps(props);

  const {
    // canAdd,
    className,
    DescriptionField,
    // disabled,
    formContext,
    formData,
    idSchema,
    // items,
    // onAddClick,
    prefixCls = "ant-form",
    // readonly,
    // registry,
    required,
    schema,
    title,
    TitleField,
    uiSchema
  } = props;
  const { options } = props || {};
  let value = formData;
  if (schema && !schema.name) {
    props.name = idSchema.$id.split("_")[1];
  }
  if (schema && !schema.title) {
    props.title = schema.name;
  }
  // const arrLength = (value && value.length) || 0;
  // const [show, setShow] = useState(false);
  // const toggle = () => setShow(o => !o);

  const { labelAlign = "right", rowGutter = 24 } = formContext;

  const labelClsBasic = `${prefixCls}-item-label`;
  const labelColClassName = classNames(
    labelClsBasic,
    labelAlign === "left" && `${labelClsBasic}-left`
    // labelCol.className,
  );
  // if (options && options.modal) {
  //   const config = isObj(options.modal) ? options.modal : {};
  //   const { text } = config;
  //   return (
  //     <div>
  //       <a className="pointer" onClick={toggle}>
  //         {text && typeof text === 'string' ? '+ ' + text : '+ setting'}
  //       </a>
  //       <span>（{arrLength}lines of data）</span>
  //       <Modal
  //         title={(schema && schema.title) || 'subsetting'}
  //         visible={show}
  //         onCancel={toggle}
  //         onOk={toggle}
  //         cancelText="close"
  //         width="80%"
  //         {...config}
  //         style={{ maxWidth: 800, ...config.style }}
  //       >
  //         <div className="fr-wrapper">
  //           <List
  //             {...props}
  //             options={options}
  //             value={value}
  //           />
  //         </div>
  //       </Modal>
  //     </div>
  //   );
  // }
  // if (options && options.drawer) {
  //   const config = isObj(options.drawer) ? options.drawer : {};
  //   const { text } = config;
  //   return (
  //     <div>
  //       <a className="pointer" onClick={toggle}>
  //         {text && typeof text === 'string' ? '+ ' + text : '+ setting'}
  //       </a>
  //       <Drawer
  //         title={(schema && schema.title) || 'subsetting'}
  //         visible={show}
  //         onClose={toggle}
  //         width="80%"
  //         {...config}
  //       >
  //         <div className="fr-wrapper">
  //           <List
  //             {...props}
  //             options={options}
  //             value={value}
  //           />
  //         </div>
  //       </Drawer>
  //     </div>
  //   );
  // }
  const fieldSetClassName = classNames(
    className,
    "fr-field w-100 fr-field-complex"
  );
  return (
    <fieldset className={fieldSetClassName} id={idSchema.$id}>
      <Row gutter={rowGutter}>
        {title && (
          <Col className={labelColClassName} span={24}>
            <TitleField
              id={`${idSchema.$id}__title`}
              key={`array-field-title-${idSchema.$id}`}
              required={required}
              title={uiSchema["ui:title"] || title}
            />
          </Col>
        )}

        {(uiSchema["ui:description"] || schema.description) && (
          <Col span={24} style={DESCRIPTION_COL_STYLE}>
            <DescriptionField
              description={uiSchema["ui:description"] || schema.description}
              id={`${idSchema.$id}-description`}
              key={`array-field-description-${idSchema.$id}`}
            />
          </Col>
        )}
      </Row>

      <List
        {...props}
        options={options}
        value={value}
        onChange={formContext.onChange || function() {}}
      />
    </fieldset>
  );
};

export default ListWithModal;
