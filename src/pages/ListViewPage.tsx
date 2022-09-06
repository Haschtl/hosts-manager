import * as React from "react";
import { Header } from "../components/Header";
import { connect } from "react-redux";
import { State } from "../store/types";
import { sortHosts } from "../hosts_manager";
// import * as actions from '../store/actions';
import HostsFileEditor from "../components/HostsFileEditor";
import SearchIcon from "../drawable/baseline_search_24.svg";
import BookMarkIcon from "../drawable/ic_collections_bookmark_24dp.svg";
import "./ListViewPage.scss";
import { Route, Routes } from "react-router-dom";

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const ListViewPage: React.FC<Props> = ({ hosts }) => {
  let sorted = sortHosts(hosts);
  console.log(sorted);

  let Blocked = (props: any) => {
    return HostsFileEditor({
      ...props,
      category: {
        content: sorted.blocked,
        applyRedirects: false,
        format: "block",
        label: "",
        type: "file",
      },
    });
  };
  let Allowed = (props: any) => {
    return HostsFileEditor({
      ...props,
      category: {
        content: sorted.allowed,
        applyRedirects: false,
        format: "block",
        label: "",
        type: "file",
      },
    });
  };
  let Redirected = (props: any) => {
    return HostsFileEditor({
      ...props,
      category: {
        content: sorted.redirected,
        applyRedirects: false,
        format: "block",
        label: "",
        type: "file",
      },
    });
  };
  return (
    <Routes key="listroot">
      <Route path="blocked">
        <Blocked />
      </Route>
      <Route path="allowed">
        <Allowed />
      </Route>
      <Route path="redirect">
        <Redirected />
      </Route>
    </Routes>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return { active: state.app.active, hosts: state.app.hosts };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListViewPage);

type HProps = {
  children?: React.ReactNode;
};
let ListHeader: React.FC<HProps> = ({}) => {
  return (
    <Header>
      {/* <div style={headerStyle.text}>{props.route.name}</div> */}
      <div className="buttonwrapper">
        <div className="button">
          <SearchIcon />
        </div>
        <div className="button">
          <BookMarkIcon />
        </div>
      </div>
    </Header>
  );
};
