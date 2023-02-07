/* eslint-disable promise/catch-or-return */
/* eslint-disable no-console */
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import { NavPageContainer } from 'react-windows-ui';

import { State } from '../store/types';
import './DNSPage.scss';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const DNSPage: React.FC<Props> = () => {
  const [isAvailable, setAvailable] = React.useState(true);
  React.useEffect(() => {
    window.files.testPort('localhost', 5380).then((v) => setAvailable(v));
  }, []);
  return (
    <NavPageContainer animateTransition>
      <div className="page full dnsserver">
        {isAvailable ? (
          <iframe
            title="Technitium DNS Server"
            src="http://localhost:5380"
            className="iframe-dns-server"
          />
        ) : (
          <div className="p20">
            <h1>DNS-Server</h1>
            <p>
              Technitium DNS-Server is not running. Please install and run the
              service
            </p>
          </div>
        )}
      </div>
    </NavPageContainer>
  );
};

const mapDispatchToProps = {};
const mapStateToProps = (state: State) => {
  return { searchText: state.app.searchText };
};
export default connect(mapStateToProps, mapDispatchToProps)(DNSPage);
