import React from 'react';
import { connect } from 'react-redux';
import { NavPageContainer, Button } from 'react-windows-ui';

import { State } from '../store/types';
import PayPalIcon from '../../../assets/icons8/icons8-paypal-48.png';
import GithubIcon from '../../../assets/icons8/icons8-github-48.png';
import './SupportPage.scss';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const SupportPage: React.FC<Props> = () => {
  return (
    <NavPageContainer animateTransition>
      <div className="page full support">
        <div className="background">
          <div className="textWrapper">
            <i className="icons10-heart" style={{ fontSize: '120px' }} />
            <div className="title">Support Me!</div>
          </div>
          <div className="changelog">
            <div className="text">
              This is a free and open-source application. I develop it in my
              free time. If you like it, please support me:
            </div>
            <div className="buttonbar">
              <Button
                style={{ height: '50px' }}
                value="Sponsor"
                onClick={() =>
                  window.open('https://paypal.me/haschtl', '_blank')
                }
                icon={
                  <img
                    src={PayPalIcon}
                    style={{ height: '30px' }}
                    alt="PayPal"
                  />
                }
              />
              <Button
                style={{ height: '50px' }}
                value="Contribute"
                onClick={() =>
                  window.open(
                    'https://github.com/haschtl/hosts-manager',
                    '_blank'
                  )
                }
                icon={
                  <img
                    src={GithubIcon}
                    style={{ height: '30px' }}
                    alt="PayPal"
                  />
                }
              />
            </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(SupportPage);
