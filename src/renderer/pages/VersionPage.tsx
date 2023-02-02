import React from 'react';
import { connect } from 'react-redux';
import { NavPageContainer } from 'react-windows-ui';

import { State } from '../store/types';
import AppIcon from '../../../assets/drawable/icon_foreground.png';
import PayPalIcon from '../../../assets/drawable/paypal.svg';
import GithubIcon from '../../../assets/drawable/ic_github_24dp.svg';
import './VersionPage.scss';

// import shell from "electron";
export const openSupportWebsite = () => {
  const url = 'https://google.de';
  // shell.openExternal(url);
};
export const openPaypal = () => {
  const url = 'https://paypal.com';
  // shell.openExternal(url);
};
type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const VersionPage: React.FC<Props> = () => {
  return (
    <NavPageContainer animateTransition>
      <div className="page full version">
        <div className="background">
          <div className="textWrapper">
            <img src={AppIcon} alt="app-icon" />
            <div className="title">You are up to date</div>
          </div>
          <div className="changelog">
            <div
              className="subtitle"
              style={{
                color: 'var(--white)',
              }}
            >
              Latest changes
            </div>
            <div className="change">- Fix hosts file install</div>
          </div>
        </div>
        {/* <Footer /> */}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://icons8.com/icon/zvzyoB3xqw1m/firewall"
        >
          Firewall
        </a>{' '}
        icon by{' '}
        <a target="_blank" rel="noreferrer" href="https://icons8.com">
          Icons8
        </a>
      </div>
    </NavPageContainer>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return { active: state.app.active };
};
export default connect(mapStateToProps, mapDispatchToProps)(VersionPage);
