import * as React from "react";
import { connect } from "react-redux";
import { State } from "../store/types";
import { HostsCategory, HostsLine } from "../hosts_manager";
import HostLineEditor from "./HostLineEditor";
import "./ListViewElement.scss";
import * as actions from "../store/actions";
import Popup from "./Popup";

type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

type OwnProps = {
  idx: number;
  line: HostsLine;
  category: HostsCategory;
  editable?: boolean;
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
  let onSave = (_line: HostsLine) => {
    setHostsLine(category, idx, _line);
    setIsOpen(false);
  };
  let onRemove = () => {
    rmHostsLine(category, idx);
    setIsOpen(false);
  };
  let onDismiss = () => setIsOpen(false);
  return (
    <div className="button list-view-element" onClick={openPopup}>
      <Popup
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
      </Popup>
      <input type="checkbox" value={line.enabled + ""} />
      <div className="text">{line.domain}</div>
      <div className="host">{line.host}</div>
    </div>
  );
};

const mapDispatchToProps = {
  rmHostsLine: actions.rmHostsLine,
  setHostsLine: actions.setHostsLine,
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    active: state.app.active,
    hosts: state.app.hosts,
    // line: state.app.hosts.categories,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListViewElement);
