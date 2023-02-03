/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import { NavPageContainer, TableView, LoaderBusy } from 'react-windows-ui';
import { Route, Routes, useNavigate } from 'react-router';

import Breadcrumbs from '../components/Breadcrumbs';
import { State } from '../store/types';
import ListItem from '../components/ListItem';
// import RecordIcon from '../../../assets/drawable/ic_record_24dp.svg';
// import SortIcon from '../../../assets/drawable/baseline_sort_by_alpha_24.svg';
// import DeleteIcon from '../../../assets/drawable/outline_delete_24.svg';
import './FirewallPage.scss';
import { filterAny } from '../components/Search';
// import { FirewallRule } from '../../shared/types';
// import { NotImplemented } from '../components/NotImplemented';

type OwnProps = {
  filter: string;
};
type LProps = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;
type HProps = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const DNSListPageFC: React.FC<LProps> = ({ rules, filter, searchText }) => {
  const filteredRules = rules
    .filter((v) => v.Direction === filter)
    .filter(filterAny(searchText));

  return (
    <NavPageContainer animateTransition>
      {/* <NotImplemented isOpen={notImplemented} onDismiss={hideNotImplemented} /> */}
      <div className="page dns">
        <Breadcrumbs
          title={filter}
          history={[{ title: 'Firewall', to: '/firewall' }]}
        />
        {/* <CommandBar>
          <CommandBar.Button
            value="New rule"
            icon={<i className="icons10-plus color-success" />}
          />

          <CommandBar.SplitDivider />
          <CommandBar.Button
            value="Filter"
            icon={<img src={SortIcon} alt="sort" className="commandbar-img" />}
          />
        </CommandBar> */}
        <div className="content">
          <p>View Firewall-{filter} rules.</p>
          {/* <p className="app-para-light">
            For more options use Windows-Firewall directly.
          </p> */}
        </div>
        {rules?.length === 0 ? (
          <LoaderBusy />
        ) : (
          <TableView
            rows={
              filteredRules.map((r) => [
                r.Action,
                r.Enabled,
                // r.DisplayGroup,
                // r.Profile,
                r.DisplayName,
                r.Description,
                r.Profile,
                // r.PolicyStoreSource,
              ]) as any
            }
            columns={
              [
                { title: 'Action' },
                { title: 'Enabled' },
                // { title: 'DisplayGroup' },
                // { title: 'Profile' },
                { title: 'DisplayName' },
                { title: 'Description' },
                { title: 'Profile' },
                // { title: 'PolicyStoreSource' },
              ] as any
            }
          />
        )}
      </div>
    </NavPageContainer>
  );
};

const DNSHomePageFC: React.FC<HProps> = ({ rules, searchText }) => {
  const navigate = useNavigate();
  const navigateInbound = React.useCallback(() => {
    navigate('/firewall/inbound');
  }, [navigate]);
  const navigateOutbound = React.useCallback(() => {
    navigate('/firewall/outbound');
  }, [navigate]);
  return (
    <NavPageContainer animateTransition>
      <div className="page dns">
        <h1>Firewall</h1>
        <div className="content">
          <p>View and configure Windows-Firewall rules.</p>
          <p className="app-para-light">
            Inbound rules control which applications on this computer can
            establish connections to the internet. Outbound rules control
            requests from the outside
          </p>
        </div>
        <ListItem
          onClick={navigateInbound}
          title="Inbound"
          icon="icons10-download"
          subtitle={`${
            rules.filter((r) => r.Direction === 'Inbound').length
          } rules`}
          ItemEndComponent={rules?.length === 0 ? <LoaderBusy /> : <></>}
        />
        <ListItem
          onClick={navigateOutbound}
          icon="icons10-upload"
          title="Outbound"
          subtitle={`${
            rules.filter((r) => r.Direction === 'Outbound').length
          } rules`}
          ItemEndComponent={rules?.length === 0 ? <LoaderBusy /> : <></>}
        />
      </div>
    </NavPageContainer>
  );
};

const mapDispatchToProps = {};
const mapStateToProps = (state: State) => {
  return { rules: state.app.firewall.rules, searchText: state.app.searchText };
};
export const DNSHomePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DNSHomePageFC);

export const DNSListPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DNSListPageFC);

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const DNSPage: React.FC<Props> = () => {
  return (
    <Routes key="firewallroot">
      <Route path="outbound" element={<DNSListPage filter="Outbound" />} />
      <Route path="inbound" element={<DNSListPage filter="Inbound" />} />
      <Route path="/" element={<DNSHomePage />} />
    </Routes>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DNSPage);
