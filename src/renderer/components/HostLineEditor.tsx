import * as React from 'react';
import { connect } from 'react-redux';

import { State } from '../store/types';
import { HostsLine } from '../../shared/types';
import { CheckBox, TextInputStyled } from './Inputs';
import './HostLineEditor.scss';
import BackIcon from '../../../assets/drawable/baseline_arrow_left.svg';
import DeleteIcon from '../../../assets/drawable/outline_delete_24.svg';
import SaveIcon from '../../../assets/drawable/baseline_check_24.svg';

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
      <div className="buttonbar">
        <button
          type="button"
          className="button iconWrapper"
          onClick={onDismiss}
        >
          <img src={BackIcon} alt="back" />
        </button>
        <div className="buttonbar2">
          <button type="button" className="button iconWrapper" onClick={remove}>
            <img src={DeleteIcon} alt="delete" />
          </button>
          <button type="button" className="button iconWrapper" onClick={save}>
            <img src={SaveIcon} alt="save" />
          </button>
        </div>
      </div>
      <TextInputStyled
        label="Domain"
        value={current.domain}
        onChange={onDomainChange}
      />
      <TextInputStyled
        label="Host"
        value={current.host}
        onChange={onHostChange}
      />
      <TextInputStyled
        label="Comment"
        value={current.comment}
        onChange={onCommentChange}
      />
      <div className="element">
        <CheckBox value={current.enabled} onChange={toggleEnabled} />
        <div className="text">Enabled</div>
      </div>
    </div>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(HostLineEditor);
