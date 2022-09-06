import React, { useState } from "react";
import Footer from "../components/Footer";
import { connect } from "react-redux";
// import { shell } from "electron";
// import path from 'node:path';
import { State } from "../store/types";
// import SvgUri from 'react-native-svg-uri';
import { NotImplemented } from "../components/NotImplemented";
import { sortHosts } from "../hosts_manager";
import { checkBackendService, saveHostsFile, user_folder } from "../files";
import { useNavigate } from "react-router";
// import isElevated from '../utils/isElevated';
// import {IsDarkMode} from '../styles/styles';
import BookMarkIcon from "../drawable/ic_collections_bookmark_24dp.svg";
import AddIcon from "../drawable/ic_get_app_24dp.svg";
import SyncIcon from "../drawable/ic_sync_24dp.svg";
import AppIcon from "../drawable/icon_foreground.png";
import "./StartPage.scss";
const shell = window.require("electron").shell
type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const StartPage: React.FC<Props> = ({ active, hosts, isElevated }) => {
  // isElevated().then(v => setIsElevated(v));
  let navigate = useNavigate();
  let [notImplemented, setNotImplemented] = useState(false);
  let hideNotImplemented = () => {
    setNotImplemented(false);
  };

  let updateSources = () => {
    setNotImplemented(true);
  };
  let upgradeSources = () => {
    setNotImplemented(true);
  };
  let openFolder = () => {
    shell.openPath(user_folder);
  };
  let checkHostFile = () => {
    checkBackendService().then((v) => console.log(v));
  };

  let sorted = sortHosts(hosts);
  return (
    <div className="page start">
      <NotImplemented onDismiss={hideNotImplemented} isOpen={notImplemented} />
      {!isElevated && (
        <div className="button adminWarning" onClick={openFolder}>
          <div className="adminWarningText">
            AdAway not running as Admin. Can not write hosts file directly
          </div>
        </div>
      )}
      <div>
        <StartHeader
          active={active}
          blocked={sorted.blocked.length}
          redirected={sorted.redirected.length}
          allowed={sorted.allowed.length}
        />
        <div className="content">
          <div
            className="button mainbutton"
            onClick={() => navigate("sources")}
          >
            <div className="buttonbar">
              <div className="mainleft">
                <BookMarkIcon />
              </div>

              <div className="maincenter">
                <div>{hosts.categories.length + " aktuelle Quellen"}</div>
                <div>{"0 veraltete Quellen"}</div>
              </div>
              <div className="mainright">
                <div
                  className="button"
                  style={{ margin: 5 }}
                  onClick={updateSources}
                >
                  <SyncIcon />
                </div>
                <div
                  className="button"
                  style={{ margin: 5 }}
                  onClick={upgradeSources}
                >
                  <AddIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="buttonbar">
          <HeaderButton
            subtitle="Show DNS-Request-Protocol"
            icon={require("../drawable/ic_outline_rule_24.svg")}
            onClick={() => navigate("dns")}
          />
          <HeaderButton
            subtitle="Show Tips and Help"
            icon={require("../drawable/ic_help_24dp.svg")}
            onClick={() => navigate("help")}
          />
          <HeaderButton
            subtitle="Support"
            icon={require("../drawable/baseline_favorite_24.svg")}
            onClick={() => navigate("support")}
          />
        </div>
        <div
          className="button"
          onClick={() => {
            saveHostsFile(hosts);
          }}
        >
          Export hosts
        </div>
        <div className="button" onClick={checkHostFile}>
          Check backend
        </div>
      </div>
      <Footer />
    </div>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return {
    active: state.app.active,
    hosts: state.app.hosts,
    isElevated: state.app.isElevated,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(StartPage);

type HProps = {
  active: boolean;
  allowed: number;
  blocked: number;
  redirected: number;
};
export const StartHeader: React.FC<HProps> = ({
  active,
  allowed,
  blocked,
  redirected,
}) => {
  let navigate = useNavigate();
  const goToVersion = () => {
    navigate("version");
  };
  return (
    <>
      <div className={"header-background " + active ? "active" : "inactive"}>
        <div className="iconwrapper">
          <AppIcon />
        </div>
        <div className="textWrapper">
          <div className="title">AdAway</div>
          <div className="subtitle">Open Source ad blocker</div>
        </div>
        <div className="abs_version" onClick={goToVersion}>
          {"1.0.0"}
        </div>
        <div className="abs_buttonbar">
          <HeaderButton
            title={blocked + ""}
            subtitle="Blocked"
            icon="../drawable/baseline_block_24.svg"
            onClick={() => navigate("list")}
          />
          <HeaderButton
            title={allowed + ""}
            subtitle="Allowed"
            icon="../drawable/baseline_check_24.svg"
            onClick={() => navigate("list")}
          />
          <HeaderButton
            title={redirected + ""}
            subtitle="Redirected"
            icon="../drawable/baseline_compare_arrows_24.svg"
            onClick={() => navigate("list")}
          />
        </div>
      </div>
    </>
  );
};

interface HBProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  onClick?(): void;
}
export const HeaderButton: React.FC<HBProps> = ({
  title,
  subtitle,
  icon,
  onClick,
}) => {
  return (
    <div className="buttonwrapper">
      <div className="button headerbutton" onClick={onClick}>
        <div className="content">
          {title !== undefined && <div className="title">{title}</div>}
          {subtitle !== undefined && <div className="subtitle">{subtitle}</div>}
        </div>
      </div>
      {icon !== undefined ? (
        <div className="buttonicon">
          <img src={icon} className="icon" />
        </div>
      ) : null}
    </div>
  );
};
