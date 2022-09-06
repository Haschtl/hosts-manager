import React from "react";
import Footer from "../components/Footer";
import { connect } from "react-redux";
import { State } from "../store/types";
import FavoritesIcon from "../drawable/baseline_favorite_24.svg"
import PayPalIcon from "../drawable/paypal.svg"
import GithubIcon from "../drawable/ic_github_24dp.svg"
import "./SupportPage.scss";

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const SupportPage: React.FC<Props> = ({ }) => {
  return (
    <div className="page support">
      <div className="background">
        <div className="textWrapper">
          <FavoritesIcon />
          <div className="title">Support Me!</div>
        </div>
        <div className="changelog">
          <div className="text">
            This is a free and open-source application. I develop it in my free
            time. If you like it, please support me:
          </div>
          <div className="buttonbar">
            <div className="button supportButton">
              <PayPalIcon />
              <div style={{ marginLeft: 5 }}>Spenden</div>
            </div>
            <div className="button supportButton">
              <GithubIcon />
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
export default connect(mapStateToProps, mapDispatchToProps)(SupportPage);
