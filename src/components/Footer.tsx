import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import * as actions from "../store/actions";
import { State } from "../store/types";
import HomeIcon from "../drawable/baseline_favorite_24.svg";
import GithubIcon from "../drawable/ic_github_24dp.svg";
import MenuIcon from "../drawable/ic_menu_24dp.svg";
import SettingsIcon from "../drawable/ic_settings_24dp.svg";
import PauseIcon from "../drawable/ic_pause_24dp.svg";
import LogoIcon from "../drawable/icon_white.svg";
import "./Footer.scss";
// import { closeWindow } from "../files";
// const { remote } = window.require("electron");

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const Footer: React.FC<Props> = ({ active, setActive, isElevated }) => {
  let _navigate = useNavigate();
  const navigate = (v: string) => {
    _navigate(v);
    setMenuVisible(false);
  };
  let [menuVisible, setMenuVisible] = useState(false);
  let onClick = () => setMenuVisible(!menuVisible);
  let toggleActive = () => {
    if (isElevated) {
      setActive(!active);
    }
  };
  let _closeWindow = () => {
    // var window = remote.getCurrentWindow();
    // window.close();
    // closeWindow()
  };
  return (
    <div className="footer">
      <div className={"menu " + (menuVisible ? "visible" : "hidden")}>
        <div className="button menuEntry" onClick={() => navigate("/start")}>
          <img src={HomeIcon} />
          <div>Home</div>
        </div>
        <div className="button menuEntry" onClick={() => navigate("/support")}>
          <img src={GithubIcon} />
          <div>Github project</div>
        </div>
        <div className="button menuEntry" onClick={() => navigate("/settings")}>
          <img src={SettingsIcon} />
          <div>Options</div>
        </div>
        <div className="button menuEntry" onClick={() => _closeWindow()}>
          <img src={SettingsIcon} />
          <div>Minimize</div>
        </div>
      </div>
      <div className="wrapper">
        <div className="button" style={{ marginLeft: 10 }} onClick={onClick}>
          <img src={MenuIcon} />
        </div>
        <div className="center">
          <div
            className={"button statebutton " + (active ? "active" : "inactive")}
            onClick={toggleActive}
          >
            {active ? <img src={PauseIcon} /> : <img src={LogoIcon} />}
          </div>
        </div>
      </div>
    </div>
  );
};
const mapDispatchToProps = { setActive: actions.setActive };
const mapStateToProps = (state: State) => {
  return { active: state.app.active, isElevated: state.app.isElevated };
};
export default connect(mapStateToProps, mapDispatchToProps)(Footer);
