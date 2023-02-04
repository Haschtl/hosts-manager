import * as React from 'react';
import { connect } from 'react-redux';
import { Button, InputText, Checkbox } from 'react-windows-ui';

import { HostsLine } from '../../shared/types';
import ListItem from './ListItem';
import './HostLineEditor.scss';

type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

type OwnProps = {
  line: HostsLine;
  onSave(line: HostsLine): void;
  onRemove(line: HostsLine): void;
};
const HostLineEditor: React.FC<Props> = ({ line, onSave, onRemove }) => {
  const [current, setCurrent] = React.useState<HostsLine>(line);
  const onDomainChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrent({ ...current, domain: e.target.value });
    },
    [current]
  );
  const onHostChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrent({ ...current, host: e.target.value });
    },
    [current]
  );
  const onCommentChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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

const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(HostLineEditor);
