/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Dialog } from 'react-windows-ui';

import { State } from '../store/types';
import { HostsFile, HostsLine } from '../../shared/types';
import HostLineEditor from './HostLineEditor';
import './ListViewElement.scss';
import ListItem from './ListItem';

// const portalRoot = document.querySelector('.page');
type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

type OwnProps = {
  idx: number;
  line: HostsLine;
  file?: HostsFile;
  editable?: boolean;
  setHostsLine(file: HostsFile, idx: number, line: HostsLine): void;
  rmHostsLine(file: HostsFile, idx: number): void;
};
const ListViewElement: React.FC<Props> = ({
  line,
  idx,
  file,
  rmHostsLine,
  setHostsLine,
  editable,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const openPopup = () => {
    if (editable) {
      setIsOpen(true);
    }
  };
  const toggleCheckbox = React.useCallback(() => {
    if (file) {
      setHostsLine(file, idx, { ...line, enabled: !line.enabled });
    }
  }, [file, idx, line, setHostsLine]);
  const onSave = React.useCallback(
    (_line: HostsLine) => {
      if (file) {
        setIsOpen(false);
        setHostsLine(file, idx, _line);
      }
    },
    [setIsOpen, setHostsLine, file, idx]
  );
  const onRemove = React.useCallback(() => {
    if (file) {
      setIsOpen(false);
      rmHostsLine(file, idx);
    }
  }, [rmHostsLine, setIsOpen, file, idx]);

  const onDismiss = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  const editablePlus = editable && line.domain !== undefined;
  return (
    <>
      {isOpen === true && (
        <Dialog
          isVisible={isOpen}
          // @ts-ignore
          style={{ padding: 20 }}
          onBackdropPress={onDismiss}
        >
          <h2 className="app-m-0">Edit</h2>
          <p>Edit this line</p>
          <HostLineEditor
            line={line}
            onDismiss={onDismiss}
            onSave={onSave}
            onRemove={onRemove}
          />
        </Dialog>
      )}
      <ListItem
        onClick={openPopup}
        enabled={line.enabled}
        ItemEndComponent={
          editablePlus ? (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'flex', height: '100%' }}
            >
              <Switch
                disabled={!editable}
                labelOn="On"
                labelOff="Off"
                onChange={toggleCheckbox}
                defaultChecked={line.enabled}
                labelPosition="start"
              />
            </div>
          ) : (
            <></>
          )
        }
        title={
          line.comment && line.comment !== ''
            ? `${line.domain ? line.domain : ''} #${line.comment}`
            : line.domain
        }
        subtitle={line.host}
      />
    </>
  );
};

const mapDispatchToProps = {
  // rmHostsLine: actions.rmHostsLine,
  // setHostsLine: actions.setHostsLine,
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    // line: state.app.hosts.categories,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListViewElement);
