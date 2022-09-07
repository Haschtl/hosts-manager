import * as React from "react";
import { connect } from "react-redux";
import { State } from "../store/types";
import { HostsLine } from "../hosts_manager";
import { CheckBox, TextInputStyled } from "./Inputs";
import "./HostLineEditor.scss";
import BackIcon from "../drawable/baseline_arrow_left.svg";
import DeleteIcon from "../drawable/outline_delete_24.svg";
import SaveIcon from "../drawable/baseline_check_24.svg";
type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

type OwnProps = {
  line: HostsLine;
  onSave(line: HostsLine): void;
  onRemove(line: HostsLine): void;
  onDismiss(): void;
};
let HostLineEditor: React.FC<Props> = ({
  line,
  onSave,
  onDismiss,
  onRemove,
}) => {
  let [current, setCurrent] = React.useState<HostsLine>(line);
  let onDomainChange = (text: string) => {
    setCurrent({ ...current, domain: text });
  };
  let onHostChange = (text: string) => {
    setCurrent({ ...current, host: text });
  };
  let onCommentChange = (text: string) => {
    setCurrent({ ...current, comment: text });
  };
  let toggleEnabled = () => {
    setCurrent({ ...current, enabled: !current.enabled });
  };
  let _onSave = () => {
    console.log("line-editor",current)
    onSave(current);
  };
  let _onRemove = () => {
    onRemove(current);
  };
  return (
    <div className="hostline-editor">
      <div className="buttonbar">
        <div className="button iconWrapper" onClick={onDismiss}>
          <img src={BackIcon} />
        </div>
        <div className="buttonbar2">
          <div className="button iconWrapper" onClick={_onRemove}>
            <img src={DeleteIcon} />
          </div>
          <div className="button iconWrapper" onClick={_onSave}>
            <img src={SaveIcon} />
          </div>
        </div>
      </div>
      <TextInputStyled
        label={"Domain"}
        value={current.domain}
        onChange={onDomainChange}
      />
      <TextInputStyled
        label={"Host"}
        value={current.host}
        onChange={onHostChange}
      />
      <TextInputStyled
        label={"Comment"}
        value={current.comment}
        onChange={onCommentChange}
      />
      <div className="element">
        <CheckBox
          value={current.enabled}
          onChange={toggleEnabled}
        />
        <div className="text">Enabled</div>
      </div>
    </div>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return { active: state.app.active, hosts: state.app.hosts };
};
export default connect(mapStateToProps, mapDispatchToProps)(HostLineEditor);
