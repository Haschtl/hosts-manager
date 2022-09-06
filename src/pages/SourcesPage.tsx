import * as React from "react";
import { Header } from "../components/Header";
// import {Footer} from '../components/Footer';

import { connect } from "react-redux";
import { State } from "../store/types";
import * as actions from "../store/actions";
import SourceListElement from "../components/SourceListElement";
import { HostsCategory } from "../hosts_manager";
import { useNavigate } from "react-router";
import AddIcon from "../drawable/ic_add_black_24px.svg";
import "./SourcesPage.scss";

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const SourcesPage: React.FC<Props> = ({ hosts }) => {
  let navigate = useNavigate();
  let addSource = () => {
    navigate("editsource", {
      state: {
        source: {
          enabled: true,
          label: "",
          format: "block",
          type: "url",
          content: [],
          applyRedirects: false,
        } as HostsCategory,
        idx: -1,
      },
    });
  };
  return (
    <div className="page sources-page">
      <SourcesHeader />
      <div className="list">
        {hosts.categories.map((s, idx) => (
          <SourceListElement source={s} idx={idx} key={"category" + idx} />
        ))}
      </div>
      <div className="floating-button" onClick={addSource}>
        <AddIcon />
      </div>
    </div>
  );
};

// const mapDispatchToProps = (dispatch: any) =>
//   bindActionCreators({setState: actions.setState}, dispatch);
const mapDispatchToProps = {
  setState: actions.setState,
};

const mapStateToProps = (state: State) => {
  return { active: state.app.active, hosts: state.app.hosts };
};
export default connect(mapStateToProps, mapDispatchToProps)(SourcesPage);

type HProps = {
  children?: React.ReactNode;
};
let SourcesHeader: React.FC<HProps> = ({}) => {
  return (
    <Header>
      <div className="text">Hosts-Sources</div>
      <div className="buttonwrapper"></div>
    </Header>
  );
};
