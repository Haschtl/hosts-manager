import * as React from "react";
import * as ReactDOM from "react-dom";

import { connect } from "react-redux";
import { State } from "../store/types";
import { HostsCategory, HostsLine } from "../hosts_manager";
import HostLineEditor from "./HostLineEditor";
import "./ListViewElement.scss";
import * as actions from "../store/actions";
import Popup from "./Popup";
import { CheckBox } from "./Inputs";

const portalRoot = document.querySelector(".page");
type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

type OwnProps = {
  idx: number;
  line: HostsLine;
  category: HostsCategory;
  editable?: boolean;
  setHostsLine(category: HostsCategory, idx: number, line: HostsLine): void;
  rmHostsLine(category: HostsCategory, idx: number): void;
};
let ListViewElement: React.FC<Props> = ({
  line,
  idx,
  category,
  rmHostsLine,
  setHostsLine,
  editable,
}) => {
  let [isOpen, setIsOpen] = React.useState(false);
  let openPopup = () => {
    if (editable) {
      setIsOpen(true);
    }
  };
  let toggleCheckbox = (v: boolean) => {
    setHostsLine(category, idx, { ...line, enabled: !line.enabled });
  };
  let onSave = React.useCallback(
    (_line: HostsLine) => {
      console.log("list-element", _line, idx);
      setIsOpen(false);
      setHostsLine(category, idx, _line);
    },
    [setIsOpen, setHostsLine, category, idx]
  );
  let onRemove = React.useCallback(() => {
    setIsOpen(false);
    rmHostsLine(category, idx);
  }, [rmHostsLine, setIsOpen, category, idx]);

  let onDismiss = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  return (
    <>
      {isOpen === true && (
        <Popup isOpen={isOpen} onDismiss={onDismiss}>
          <HostLineEditor
            line={line}
            onDismiss={onDismiss}
            onSave={onSave}
            onRemove={onRemove}
          />
        </Popup>
      )}
      <div className="button list-view-element">
        {/* // ReactDOM.createPortal(popup, portalRoot || document.body)} */}
        {/* <Popup
        isOpen={isOpen}
        onDismiss={() => {
          onDismiss();
        }}
      >
        <HostLineEditor
          line={line}
          onDismiss={onDismiss}
          onSave={onSave}
          onRemove={onRemove}
        />
      </Popup> */}
        {editable && (
          <CheckBox value={line.enabled} onChange={toggleCheckbox} />
        )}
        <div className="list-view-content" onClick={openPopup}>
          <div className="text">
            {line.domain ? line.domain : "example.com"}
          </div>
          <div className="host">{line.host ? line.host : "0.0.0.0"}</div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = {
  // rmHostsLine: actions.rmHostsLine,
  // setHostsLine: actions.setHostsLine,
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    active: state.app.active,
    hosts: state.app.hosts,
    // line: state.app.hosts.categories,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListViewElement);
