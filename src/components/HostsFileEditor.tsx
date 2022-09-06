import * as React from "react";
import { HostsCategory } from "../hosts_manager";
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
};
let HostsFileEditor: React.FC<Props> = ({
  category,
  showAddButton = false,
  editable = false,
}) => {
  const renderRow = ({ index, key, style }: any) => (
    <ListViewElement
      line={category.content[index]}
      idx={index}
      key={key}
      category={category}
      editable={editable}
    />
  );
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
              rowHeight={120}
              className="wrapper"
            />
          </>
        )}
      </AutoSizer>
      {showAddButton && (
        <div className="button addbutton">
          <AddIcon />
        </div>
      )}
    </div>
  );
};

export default HostsFileEditor;
