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
    (text: string) => {
      setCurrent({ ...current, domain: text });
    },
    [current]
  );
  const onHostChange = React.useCallback(
    (text: string) => {
      setCurrent({ ...current, host: text });
    },
    [current]
  );
  const onCommentChange = React.useCallback(
    (text: string) => {
      setCurrent({ ...current, comment: text });
    },
    [current]
  );
  const toggleEnabled = React.useCallback(() => {
    setCurrent({ ...current, enabled: !current.enabled });
  }, [current]);
  const save = () => {
    console.log('line-editor', current);
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
          <Checkbox value={current.enabled} onChange={toggleEnabled} />
        }
      />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          style={{ flex: 'auto' }}
          value="Save"
          type="success-outline"
          onClick={onSave}
        />
        &nbsp;
        <Button
          style={{ flex: 'auto' }}
          value="Remove"
          type="danger-outline"
          onClick={onRemove}
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
