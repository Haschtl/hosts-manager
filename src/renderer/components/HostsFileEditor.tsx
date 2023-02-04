import * as React from 'react';
import ViewportList from 'react-viewport-list';
import { connect } from 'react-redux';

import { HostsFile, HostsLine } from '../../shared/types';
import ListViewElement from './ListViewElement';
import { State } from '../store/types';
import { filterAny } from './Search';
import './HostsFileEditor.scss';
import AddIcon from '../../../assets/drawable/ic_add_black_24px.svg';

type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;
type OwnProps = {
  file?: HostsFile;
  showAddButton?: boolean;
  editable?: boolean;
  onEdit?(file: HostsFile): void;
};
const HostsFileEditor: React.FC<Props> = ({
  file,
  showAddButton = false,
  editable = false,
  onEdit = () => {},
  searchText,
}) => {
  const setHostsLine = React.useCallback(
    (cat: HostsFile, idx: number, line: HostsLine) => {
      if (file) {
        file.lines[idx] = line;
        onEdit(file);
      }
    },
    [file, onEdit]
  );
  const rmHostsLine = React.useCallback(
    (cat: HostsFile, idx: number) => {
      if (file) {
        file.lines.splice(idx, 1);
        onEdit(file);
      }
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
    if (file) {
      file.lines = [
        ...file.lines,
        { enabled: true, host: '0.0.0.0', domain: 'example.com' },
      ];
      onEdit(file);
    }
  };
  const filteredLines = file?.lines.filter(filterAny(searchText));
  if (file?.lines.length === 0) {
    return (
      <div className="hosts-file-editor">
        <p>
          This hosts file contains no hosts. Add some lines manually or download
          them.
        </p>
      </div>
    );
  }
  if (filteredLines?.length === 0) {
    return (
      <div className="hosts-file-editor">
        <p>No lines found matching &quot;{searchText}&quot;.</p>
      </div>
    );
  }
  return (
    <div className="hosts-file-editor">
      <ViewportList items={filteredLines} itemMinSize={80}>
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

const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return { searchText: state.app.searchText };
};
export default connect(mapStateToProps, mapDispatchToProps)(HostsFileEditor);
