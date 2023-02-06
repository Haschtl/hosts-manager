/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Dialog } from 'react-windows-ui';

import { HostsFile, HostsLine, HostsLinePlus } from '../../shared/types';
import { isLineFiltered } from '../../shared/helper';
import { State } from '../store/types';
import HostLineEditor from './HostLineEditor';
import './ListViewElement.scss';
import ListItem from './ListItem';

type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

type OwnProps = {
  idx: number;
  line: HostsLine | HostsLinePlus;
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
  sourcesConfig,
  includeIPv6,
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
  let title = `${line.domain ? line.domain : ''}`;
  if (line.comment && line.comment !== '') {
    title += ` #${line.comment}`;
  }
  const isFiltered = isLineFiltered(
    line,
    [],
    [],
    includeIPv6,
    sourcesConfig.sources.find(
      (s) => s.label === (line as HostsLinePlus).source
    )
  );
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
          <HostLineEditor line={line} onSave={onSave} onRemove={onRemove} />
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
            <>
              {!isFiltered ? (
                <i className="icons10-cancel color-danger" />
              ) : (
                <i className="icons10-checkmark color-success" />
              )}
            </>
          )
        }
        title={title}
        subtitle={
          (line as HostsLinePlus).source === undefined
            ? line.host
            : `${line.host} (${(line as HostsLinePlus).source})`
        }
      />
    </>
  );
};

const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return {
    sourcesConfig: state.app.sourcesConfig,
    includeIPv6: state.app.settings.ipv6,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListViewElement);
