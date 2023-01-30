import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

import * as actions from '../store/actions';
import { State } from '../store/types';
import HomeIcon from '../../../assets/drawable/baseline_favorite_24.svg';
import GithubIcon from '../../../assets/drawable/ic_github_24dp.svg';
import MenuIcon from '../../../assets/drawable/ic_menu_24dp.svg';
import SettingsIcon from '../../../assets/drawable/ic_settings_24dp.svg';
import PauseIcon from '../../../assets/drawable/ic_pause_24dp.svg';
import LogoIcon from '../../../assets/drawable/icon_white.svg';
import './Footer.scss';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const Footer: React.FC<Props> = ({ active, setActive, isElevated }) => {
  const coreNavigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);

  const navigate = useCallback(
    (v: string) => {
      coreNavigate(v);
      setMenuVisible(false);
    },
    [coreNavigate]
  );
  const navigateStart = useCallback(() => navigate('/start'), [navigate]);
  const navigateSupport = useCallback(() => navigate('/support'), [navigate]);
  const navigateSettings = useCallback(() => navigate('/settings'), [navigate]);
  const onClick = () => setMenuVisible(!menuVisible);
  const toggleActive = useCallback(() => {
    if (isElevated) {
      setActive(!active);
    }
  }, [active, isElevated, setActive]);
  // const closeWindow = () => {
  //   // var window = remote.getCurrentWindow();
  //   // window.close();
  //   // closeWindow()
  // };
  return (
    <div className="footer">
      <div className={`menu ${menuVisible ? 'visible' : 'hidden'}`}>
        <button
          type="button"
          className="button menuEntry"
          onClick={navigateStart}
        >
          <img src={HomeIcon} alt="Home" />
          <div>Home</div>
        </button>
        <button
          type="button"
          className="button menuEntry"
          onClick={navigateSupport}
        >
          <img src={GithubIcon} alt="Github project" />
          <div>Github project</div>
        </button>
        <button
          type="button"
          className="button menuEntry"
          onClick={navigateSettings}
        >
          <img src={SettingsIcon} alt="Options" />
          <div>Options</div>
        </button>
        {/* <div className="button menuEntry" onClick={() => _closeWindow()}>
          <img src={SettingsIcon} />
          <div>Minimize</div>
        </div> */}
      </div>
      <div className="wrapper">
        <button
          type="button"
          className="button"
          style={{ marginLeft: 10 }}
          onClick={onClick}
        >
          <img src={MenuIcon} alt="Menu" />
        </button>
        <div className="center">
          <button
            type="button"
            className={`button statebutton ${active ? 'active' : 'inactive'}`}
            onClick={toggleActive}
          >
            {active ? (
              <img src={PauseIcon} alt="Pause" />
            ) : (
              <img src={LogoIcon} alt="Logo" />
            )}
          </button>
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
