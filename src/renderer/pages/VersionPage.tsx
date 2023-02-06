import React from 'react';
import { connect } from 'react-redux';
import { NavPageContainer } from 'react-windows-ui';

import { State } from '../store/types';
import AppIcon from '../../../assets/icon.png';
import './VersionPage.scss';

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
      </div>
    </NavPageContainer>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return { active: state.app.active };
};
export default connect(mapStateToProps, mapDispatchToProps)(VersionPage);
