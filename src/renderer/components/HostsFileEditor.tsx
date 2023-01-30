import * as React from 'react';
import ViewportList from 'react-viewport-list';

import { HostsCategory, HostsLine } from '../../shared/types';
// import * as actions from '../store/actions';
import ListViewElement from './ListViewElement';
// import {List} from "react-virtualized"
// import List from "react-virtualized/dist/commonjs/List";
// import { FixedSizeList as List } from "react-window";

import AddIcon from '../../../assets/drawable/ic_add_black_24px.svg';
import './HostsFileEditor.scss';

type Props = {
  category: HostsCategory;
  showAddButton?: boolean;
  editable?: boolean;
  onEdit?(category: HostsCategory): void;
};
const HostsFileEditor: React.FC<Props> = ({
  category,
  showAddButton = false,
  editable = false,
  onEdit = () => {},
}) => {
  const setHostsLine = React.useCallback(
    (cat: HostsCategory, idx: number, line: HostsLine) => {
      category.content[idx] = line;
      onEdit(category);
    },
    [category, onEdit]
  );
  const rmHostsLine = React.useCallback(
    (cat: HostsCategory, idx: number) => {
      category.content.splice(idx, 1);
      onEdit(category);
    },
    [category, onEdit]
  );
  const renderRow = (item: HostsLine, index: number) => (
    <ListViewElement
      line={item}
      idx={index}
      key={`el ${index}`}
      category={category}
      editable={editable}
      rmHostsLine={rmHostsLine}
      setHostsLine={setHostsLine}
    />
  );
  const addLine = () => {
    category.content = [
      ...category.content,
      { enabled: true, host: '0.0.0.0' },
    ];
    onEdit(category);
  };
  return (
    <div className="hosts-file-editor">
      {/* <List
              width={"100%"}
              height={800}
              itemCount={category.content.length}
              itemSize={80}
              // className="wrapper"
            >
              {renderRow}
            </List> */}
      <ViewportList items={category.content} itemMinSize={80}>
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
