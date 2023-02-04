/* eslint-disable no-console */
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import {
  NavPageContainer,
  CommandBar,
  Dialog,
  Button,
  InputText,
  TableView,
} from 'react-windows-ui';

import { State } from '../store/types';
import DeleteIcon from '../../../assets/drawable/outline_delete_24.svg';
import { filterAny } from '../components/Search';
import './DNSPage.scss';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const DNSPage: React.FC<Props> = ({ searchText }) => {
  const [newDNSQueryDialogVisible, setNewDNSQueryDialogVisible] =
    React.useState(false);
  const [domain, setDomain] = React.useState('');
  const [dnsQueries, setDNSQueries] = React.useState<
    { ip?: string; domain: string; status: string; creator: string }[]
  >([]);
  const showNewDNSQueryDialog = React.useCallback(() => {
    setDomain('');
    setNewDNSQueryDialogVisible(true);
  }, []);
  const hideNewDNSQueryDialog = React.useCallback(() => {
    setNewDNSQueryDialogVisible(false);
  }, []);
  const sendQuery = React.useCallback(() => {
    window.dns
      .lookup(domain)
      .then(async (lookup) => {
        const resolve = await window.dns.resolve(domain);
        const ip = resolve ? resolve[0] : undefined;
        let status = 'Reachable';
        if (lookup.error !== null) {
          status = 'Blocked';
        }
        if (ip === '127.0.0.1' || ip === '0.0.0.0') {
          status = 'Blocked';
        }
        if (ip === undefined) {
          status = 'Unreachable';
        }
        setDNSQueries([
          ...dnsQueries,
          { ip, status, domain, creator: 'hosts-manager' },
        ]);
        setDomain('');
        setNewDNSQueryDialogVisible(false);
      })
      .catch((e) => console.log(e));
  }, [domain, dnsQueries]);
  const onDomainChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDomain(e.target?.value);
    },
    []
  );
  const clearQueries = React.useCallback(() => {
    setDNSQueries([]);
  }, []);
  const filteredQueries = dnsQueries.filter(filterAny(searchText));
  return (
    <NavPageContainer animateTransition>
      <Dialog
        isVisible={newDNSQueryDialogVisible}
        onBackdropPress={hideNewDNSQueryDialog}
      >
        {/* @ts-ignore */}
        <Dialog.Header>
          <h3>Lookup domain</h3>
          {/* @ts-ignore */}
        </Dialog.Header>
        {/* @ts-ignore */}
        <Dialog.Body style={{ padding: 20 }}>
          <p>Create a new DNS lookup query.</p>
          <InputText
            value={domain}
            onChange={onDomainChange}
            label="Domain"
            placeholder="google.com"
          />
          {/* @ts-ignore */}
        </Dialog.Body>
        {/* @ts-ignore */}
        <Dialog.Footer>
          <Button value="Abort" type="danger" onClick={hideNewDNSQueryDialog} />
          <Button value="Send" type="success" onClick={sendQuery} />
          {/* @ts-ignore */}
        </Dialog.Footer>
      </Dialog>
      <div className="page dns">
        <h1>DNS Queries</h1>
        <CommandBar>
          {/* @ts-ignore */}
          <CommandBar.Button
            value="New"
            icon={<i className="icons10-plus color-primary" />}
            onClick={showNewDNSQueryDialog}
          />

          {/* @ts-ignore */}
          <CommandBar.SplitDivider />
          {/* @ts-ignore */}
          <CommandBar.Button
            value="Clear"
            icon={
              <img src={DeleteIcon} alt="delete" className="commandbar-img" />
            }
            onClick={clearQueries}
          />
        </CommandBar>
        <div className="content">
          <p>
            Press <b>New</b> to create a DNS lookup query manually.
          </p>
        </div>
        <TableView
          // @ts-ignore
          rows={filteredQueries.map((r) => [
            r.domain,
            r.ip,
            r.status,
            r.creator,
          ])}
          columns={
            [
              { title: 'Domain' },
              { title: 'IP' },
              { title: 'Status' },
              { title: 'Initiator' },
            ] as unknown as undefined
          }
        />
      </div>
    </NavPageContainer>
  );
};

const mapDispatchToProps = {};
const mapStateToProps = (state: State) => {
  return { searchText: state.app.searchText };
};
export default connect(mapStateToProps, mapDispatchToProps)(DNSPage);
