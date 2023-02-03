import * as React from 'react';
import { connect } from 'react-redux';
import { Button, InputText, Checkbox } from 'react-windows-ui';

import { State } from '../store/types';
import { HostsLine } from '../../shared/types';
import './HostLineEditor.scss';
// import BackIcon from '../../../assets/drawable/baseline_arrow_left.svg';
// import DeleteIcon from '../../../assets/drawable/outline_delete_24.svg';
// import SaveIcon from '../../../assets/drawable/baseline_check_24.svg';
import ListItem from './ListItem';

type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

type OwnProps = {
  line: HostsLine;
  onSave(line: HostsLine): void;
  onRemove(line: HostsLine): void;
  onDismiss(): void;
};
const HostLineEditor: React.FC<Props> = ({
  line,
  onSave,
  onDismiss,
  onRemove,
}) => {
  const [current, setCurrent] = React.useState<HostsLine>(line);
  const onDomainChange = React.useCallback(
    (e: any) => {
      setCurrent({ ...current, domain: e.target.value });
    },
    [current]
  );
  const onHostChange = React.useCallback(
    (e: any) => {
      setCurrent({ ...current, host: e.target.value });
    },
    [current]
  );
  const onCommentChange = React.useCallback(
    (e: any) => {
      setCurrent({ ...current, comment: e.target.value });
    },
    [current]
  );
  const toggleEnabled = React.useCallback(() => {
    setCurrent({ ...current, enabled: !current.enabled });
  }, [current]);
  const save = () => {
    onSave(current);
  };
  const remove = () => {
    onRemove(current);
  };
  return (
    <div className="hostline-editor">
      <ListItem
        title="Domain"
        // subtitle=""
        ItemEndComponent={
          <InputText
            placeholder="example.com"
            width="300px"
            value={current.domain}
            onChange={onDomainChange}
          />
        }
      />
      <ListItem
        title="Host"
        // subtitle="Target IP-address"
        ItemEndComponent={
          <InputText
            width="300px"
            placeholder="0.0.0.0"
            value={current.host}
            onChange={onHostChange}
          />
        }
      />
      <ListItem
        title="Comment"
        // subtitle="Target IP-address"
        ItemEndComponent={
          <InputText
            width="300px"
            placeholder="Comment"
            value={current.comment}
            onChange={onCommentChange}
          />
        }
      />
      <ListItem
        title="Enabled"
        // subtitle="Target IP-address"
        ItemEndComponent={
          <Checkbox defaultChecked={current.enabled} onChange={toggleEnabled} />
        }
      />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          style={{ flex: 'auto' }}
          value="Save"
          type="success-outline"
          onClick={save}
        />
        &nbsp;
        <Button
          style={{ flex: 'auto' }}
          value="Remove"
          type="danger-outline"
          onClick={remove}
        />
      </div>
    </div>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(HostLineEditor);
