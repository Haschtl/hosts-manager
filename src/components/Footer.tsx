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
  return (
    <>
      <div className={"menu " + menuVisible ? "visible" : "invisible"}>
        <div className="button menuEntry" onClick={() => navigate("start")}>
          <HomeIcon />
          <div>Home</div>
        </div>
        <div className="button menuEntry" onClick={() => navigate("support")}>
          <GithubIcon />
          <div>Github project</div>
        </div>
        <div className="button menuEntry" onClick={() => navigate("settings")}>
          <SettingsIcon />
          <div>Options</div>
        </div>
      </div>
      <div className="wrapper">
        <div className="button" style={{ marginLeft: 10 }} onClick={onClick}>
          <MenuIcon />
        </div>
        <div className="center">
          <div
            className={"button statebutton " + active ? "active" : "inactive"}
            onClick={toggleActive}
          >
            {active ? <PauseIcon /> : <LogoIcon />}
          </div>
        </div>
      </div>
    </>
  );
};
const mapDispatchToProps = { setActive: actions.setActive };
const mapStateToProps = (state: State) => {
  return { active: state.app.active, isElevated: state.app.isElevated };
};
export default connect(mapStateToProps, mapDispatchToProps)(Footer);
