import * as React from 'react';
import ViewportList from 'react-viewport-list';
import { connect } from 'react-redux';

import { HostsFile, HostsLine } from '../../shared/types';
import ListViewElement from './ListViewElement';
import { State } from '../store/types';
import { filterAny } from './Search';
import './HostsFileEditor.scss';

type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;
type OwnProps = {
  file?: HostsFile;
  editable?: boolean;
  onEdit?(file: HostsFile): void;
};
const HostsFileEditor: React.FC<Props> = ({
  file,
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
    </div>
  );
};

const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return { searchText: state.app.searchText };
};
export default connect(mapStateToProps, mapDispatchToProps)(HostsFileEditor);
