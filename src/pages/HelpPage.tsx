import * as React from 'react';
import {Header} from '../components/Header';
// import {Footer} from '../components/Footer';
import {connect} from 'react-redux';
import {State} from '../store/types';
import "./HelpPage.scss";

type Props =
  typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps>;
const HelpPage: React.FC<Props> = ({}) => {

  return (
    <div className="page">
      <HelpHeader />
    </div>
  );
};

type HProps = {
  children?: React.ReactNode;
};
let HelpHeader: React.FC<HProps> = ({}) => {
  return (
    <Header >
      <div className="text">Help</div>
      <div className="buttonwrapper"></div>
    </Header>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return {active: state.app.active};
};
export default connect(mapStateToProps, mapDispatchToProps)(HelpPage);
