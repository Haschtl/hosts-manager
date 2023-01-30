import * as React from 'react';
import { connect } from 'react-redux';

import { Header } from '../components/Header';
import { State } from '../store/types';
import RecordIcon from '../../../assets/drawable/ic_record_24dp.svg';
import SortIcon from '../../../assets/drawable/baseline_sort_by_alpha_24.svg';
import DeleteIcon from '../../../assets/drawable/outline_delete_24.svg';
import './DNSPage.scss';

type HProps = {
  children?: React.ReactNode;
};
const DNSHeader: React.FC<HProps> = () => {
  return (
    <Header>
      <div>DNS-Requests</div>
      <div className="buttonwrapper">
        <div className="button">
          <img src={SortIcon} alt="sort" />
        </div>
        <div className="button">
          <img src={DeleteIcon} alt="delete" />
        </div>
      </div>
    </Header>
  );
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const DNSPage: React.FC<Props> = () => {
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
          <img src={RecordIcon} alt="record" />
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {};
const mapStateToProps = (state: State) => {
  return { active: state.app.active };
};
export default connect(mapStateToProps, mapDispatchToProps)(DNSPage);
