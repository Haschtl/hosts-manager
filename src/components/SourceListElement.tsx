import * as React from "react";
import { connect } from "react-redux";
import { State } from "../store/types";
import { HostsCategory } from "../hosts_manager";
import * as actions from "../store/actions";
import { useNavigate } from "react-router";
import "./SourceListElement.scss";
import { CheckBox } from "./Inputs";

type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

type OwnProps = {
  source: HostsCategory;
  idx: number;
};
let SourceListElement: React.FC<Props> = ({ source, idx, setHostCategory }) => {
  let navigate = useNavigate();
  let onClick = () => {
    navigate("/editsource", {
      state: {
        idx,
      },
    });
  };
  let toggleCategory = () => {
    setHostCategory(idx, { ...source, enabled: !source.enabled });
  };
  return (
    <div className="button source-list-element" onClick={onClick}>
      <CheckBox
        value={source.enabled}
        onChange={toggleCategory}
      />
      <div className="content">
        <div className="title">{source.label}</div>
        <div className="subtitle">{source.location}</div>
        {source.type === "url" && (
          <div className="subsubtitle">Since 3 days up to date</div>
        )}
      </div>
      <div className="fixed">{numFormatter(source.content.length)} hosts</div>
    </div>
  );
};

const mapDispatchToProps = {
  setState: actions.setState,
  setHostCategory: actions.setHostCategory,
};

const mapStateToProps = (state: State) => {
  return { active: state.app.active, hosts: state.app.hosts };
};
export default connect(mapStateToProps, mapDispatchToProps)(SourceListElement);

let numFormatter = (num: number) => {
  if (num < 1000) {
    return num + "";
  } else {
    return (num / 1000).toFixed(0) + "k";
  }
};
