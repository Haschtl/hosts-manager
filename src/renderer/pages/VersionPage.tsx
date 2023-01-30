import React from 'react';
import { connect } from 'react-redux';

import Footer from '../components/Footer';
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
    <div className="page version">
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
          <div className="subtitle" style={{ marginTop: 20 }}>
            Support development
          </div>
          <div className="buttonbar">
            <button
              type="button"
              className="button supportButton"
              onClick={openPaypal}
            >
              <img src={PayPalIcon} alt="paypal" />
              <div style={{ marginLeft: 5 }}>Spenden</div>
            </button>
            <button
              type="button"
              className="button supportButton"
              onClick={openSupportWebsite}
            >
              <img src={GithubIcon} alt="github" />
              <div style={{ marginLeft: 5 }}>Sponsor</div>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return { active: state.app.active };
};
export default connect(mapStateToProps, mapDispatchToProps)(VersionPage);
