import * as React from "react";
import { Header } from "../components/Header";
// import {Footer} from '../components/Footer';
import { connect } from "react-redux";
import { State } from "../store/types";
import RecordIcon from "../drawable/ic_record_24dp.svg";
import SortIcon from "../drawable/baseline_sort_by_alpha_24.svg";
import DeleteIcon from "../drawable/outline_delete_24.svg";
import "./DNSPage.scss";

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const DNSPage: React.FC<Props> = ({}) => {
  return (
    <div className="page dns">
      <DNSHeader />
      <div className="content">
        <div>
          Press record to start logging requests, browse the Web or use apps,
          then go back or swipe to refresh the logs.
        </div>
        <div>
          Blocked requests will not be logged. Disable ad-blocking first if you
          want to log them too.
        </div>
        <div className="floating-button">
          <img src={RecordIcon} />
        </div>
      </div>
    </div>
  );
};

type HProps = {
  children?: React.ReactNode;
};
let DNSHeader: React.FC<HProps> = ({}) => {
  return (
    <Header>
      <div>DNS-Requests</div>
      <div className="buttonwrapper">
        <div className="button">
          <img src={SortIcon} />
        </div>
        <div className="button">
          <img src={DeleteIcon} />
        </div>
      </div>
    </Header>
  );
};

const mapDispatchToProps = {};
const mapStateToProps = (state: State) => {
  return { active: state.app.active };
};
export default connect(mapStateToProps, mapDispatchToProps)(DNSPage);
