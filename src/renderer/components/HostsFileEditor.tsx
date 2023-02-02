import * as React from 'react';
import ViewportList from 'react-viewport-list';

import { HostsFile, HostsLine } from '../../shared/types';
// import * as actions from '../store/actions';

import ListViewElement from './ListViewElement';
// import {List} from "react-virtualized"
// import List from "react-virtualized/dist/commonjs/List";
// import { FixedSizeList as List } from "react-window";

import AddIcon from '../../../assets/drawable/ic_add_black_24px.svg';
import './HostsFileEditor.scss';

type Props = {
  file: HostsFile;
  showAddButton?: boolean;
  editable?: boolean;
  onEdit?(file: HostsFile): void;
};
const HostsFileEditor: React.FC<Props> = ({
  file,
  showAddButton = false,
  editable = false,
  onEdit = () => {},
}) => {
  const setHostsLine = React.useCallback(
    (cat: HostsFile, idx: number, line: HostsLine) => {
      file.lines[idx] = line;
      onEdit(file);
    },
    [file, onEdit]
  );
  const rmHostsLine = React.useCallback(
    (cat: HostsFile, idx: number) => {
      file.lines.splice(idx, 1);
      onEdit(file);
    },
    [file, onEdit]
  );
  const renderRow = (item: HostsLine, index: number) => (
    <ListViewElement
      line={item}
      idx={index}
      key={`el ${index}`}
      file={file}
      editable={editable}
      rmHostsLine={rmHostsLine}
      setHostsLine={setHostsLine}
    />
  );
  const addLine = () => {
    file.lines = [
      ...file.lines,
      { enabled: true, host: '0.0.0.0', domain: 'example.com' },
    ];
    onEdit(file);
  };
  return (
    <div className="hosts-file-editor">
      <ViewportList items={file.lines} itemMinSize={80}>
        {renderRow}
      </ViewportList>
      {showAddButton && (
        <button type="button" className="button addbutton" onClick={addLine}>
          <img src={AddIcon} alt="add" />
        </button>
      )}
    </div>
  );
};

export default HostsFileEditor;
