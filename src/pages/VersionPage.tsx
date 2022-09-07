import React from "react";
import Footer from "../components/Footer";
import { connect } from "react-redux";
// import { shell } from "electron";
import { State } from "../store/types";
import AppIcon from "../drawable/icon_foreground.png";
import PayPalIcon from "../drawable/paypal.svg";
import GithubIcon from "../drawable/ic_github_24dp.svg";
import "./VersionPage.scss";

// const shell = window.require("electron").shell;
export let openSupportWebsite = () => {
  let url = "https://google.de";
  // shell.openExternal(url);
};
export let openPaypal = () => {
  let url = "https://paypal.com";
  // shell.openExternal(url);
};
type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const VersionPage: React.FC<Props> = ({}) => {
  return (
    <div className="page version">
      <div className="background">
        <div className="textWrapper">
          <img src={AppIcon} />
          <div className="title">You are up to date</div>
        </div>
        <div className="changelog">
          <div
            className="subtitle"
            style={{
              color: "var(--white)",
            }}
          >
            Latest changes
          </div>
          <div className="change">- Fix hosts file install</div>
          <div className="subtitle" style={{ marginTop: 20 }}>
            Support development
          </div>
          <div className="buttonbar">
            <div className="button supportButton" onClick={openPaypal}>
              <img src={PayPalIcon} />
              <div style={{ marginLeft: 5 }}>Spenden</div>
            </div>
            <div className="button supportButton" onClick={openSupportWebsite}>
              <img src={GithubIcon} />
              <div style={{ marginLeft: 5 }}>Sponsor</div>
            </div>
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
