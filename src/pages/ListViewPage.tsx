import * as React from "react";
import { Header } from "../components/Header";
import { connect } from "react-redux";
import { State } from "../store/types";
import { sortHosts } from "../hosts_manager";
// import * as actions from '../store/actions';
import HostsFileEditor from "../components/HostsFileEditor";
import SearchIcon from "../drawable/baseline_search_24.svg";
import BookMarkIcon from "../drawable/ic_collections_bookmark_24dp.svg";

import BlockedIcon from "../drawable/baseline_block_24.svg";
import AllowedIcon from "../drawable/baseline_check_24.svg";
import RedirectedIcon from "../drawable/baseline_compare_arrows_24.svg";
import "./ListViewPage.scss";
import {
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
} from "react-router-dom";

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const ListViewPage: React.FC<Props> = ({ hosts }) => {
  let sorted = sortHosts(hosts);

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
  let navigate = useNavigate();
  let location = useLocation();
  let goToBlocked = React.useCallback(() => {
    navigate("/list/blocked");
  }, [navigate]);
  let goToAllowed = React.useCallback(() => {
    navigate("/list/allowed");
  }, [navigate]);
  let goToRedirected = React.useCallback(() => {
    navigate("/list/redirected");
  }, [navigate]);
  return (
    <div className="page list">
      <ListHeader>
        {location.pathname.includes("blocked")
          ? "Blocked"
          : location.pathname.includes("allowed")
          ? "Allowed"
          : "Redirected"}
      </ListHeader>
      <div className="content">
        <Routes key="listroot">
          <Route path="blocked" element={<Blocked />} />
          <Route path="allowed" element={<Allowed />} />
          <Route path="redirected" element={<Redirected />} />
        </Routes>
      </div>
      <div className="tab-bar">
        <div
          className={
            "tab-button" +
            (location.pathname.includes("blocked") ? " active" : "")
          }
          onClick={goToBlocked}
        >
          <img src={BlockedIcon} />
          Blocked
        </div>
        <div
          className={
            "tab-button" +
            (location.pathname.includes("allowed") ? " active" : "")
          }
          onClick={goToAllowed}
        >
          <img src={AllowedIcon} />
          Allowed
        </div>
        <div
          className={
            "tab-button" +
            (location.pathname.includes("redirected") ? " active" : "")
          }
          onClick={goToRedirected}
        >
          <img src={RedirectedIcon} />
          Redirected
        </div>
      </div>
    </div>
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
let ListHeader: React.FC<HProps> = ({ children }) => {
  return (
    <Header>
      {children}
      <div className="buttonwrapper">
        <div className="button">
          <img src={SearchIcon} />
        </div>
        <div className="button">
          <img src={BookMarkIcon} />
        </div>
      </div>
    </Header>
  );
};
