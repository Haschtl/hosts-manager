import * as React from "react";
import { HostsCategory, HostsLine } from "../hosts_manager";
// import * as actions from '../store/actions';
import ListViewElement from "../components/ListViewElement";
// import {List} from "react-virtualized"
import List from "react-virtualized/dist/commonjs/List";

import AddIcon from "../drawable/ic_add_black_24px.svg";
import "./HostsFileEditor.scss";
import { AutoSizer } from "react-virtualized";
type Props = {
  category: HostsCategory;
  showAddButton?: boolean;
  editable?: boolean;
  onEdit?(category: HostsCategory): void;
};
let HostsFileEditor: React.FC<Props> = ({
  category,
  showAddButton = false,
  editable = false,
  onEdit = () => {},
}) => {
  let setHostsLine = (
    category: HostsCategory,
    idx: number,
    line: HostsLine
  ) => {
    category.content[idx] = line;
    onEdit(category);
  };
  let rmHostsLine = (category: HostsCategory, idx: number) => {
    category.content.splice(idx, 1);
    onEdit(category);
  };
  const renderRow = ({ index, key, style }: any) => (
    <ListViewElement
      line={category.content[index]}
      idx={index}
      key={key}
      category={category}
      editable={editable}
      rmHostsLine={rmHostsLine}
      setHostsLine={setHostsLine}
    />
  );
  let addLine = () => {
    category.content = [
      ...category.content,
      { enabled: true, host: "0.0.0.0" },
    ];
    onEdit(category);
  };
  return (
    <div className="hosts-file-editor">
      {/*
      // @ts-ignore */}
      <AutoSizer>
        {({ width, height }) => (
          <>
            {/*
      // @ts-ignore */}
            <List
              width={width}
              height={height}
              rowRenderer={renderRow}
              rowCount={category.content.length}
              rowHeight={70}
              // className="wrapper"
            />
          </>
        )}
      </AutoSizer>
      {showAddButton && (
        <div className="button addbutton" onClick={addLine}>
          <img src={AddIcon} />
        </div>
      )}
    </div>
  );
};

export default HostsFileEditor;
