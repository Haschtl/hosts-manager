import * as React from 'react';
import { connect } from 'react-redux';

import { Header } from '../components/Header';
import { State } from '../store/types';
import './HelpPage.scss';

type HProps = {
  children?: React.ReactNode;
};
const HelpHeader: React.FC<HProps> = () => {
  return (
    <Header>
      <div className="text">Help</div>
      <div className="buttonwrapper" />
    </Header>
  );
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const HelpPage: React.FC<Props> = () => {
  return (
    <div className="page">
      <HelpHeader />
    </div>
  );
};

const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return { active: state.app.active };
};
export default connect(mapStateToProps, mapDispatchToProps)(HelpPage);
