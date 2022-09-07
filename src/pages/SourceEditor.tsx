import * as React from "react";
import { Header } from "../components/Header";
import { connect } from "react-redux";
import { State } from "../store/types";
import { HostsCategory } from "../hosts_manager";
import * as actions from "../store/actions";
import HostsFileEditor from "../components/HostsFileEditor";
import { SwitchStyled, TextInputStyled } from "../components/Inputs";
import { useLocation, useNavigate, useRoutes } from "react-router";
import { useMatch } from "react-router-dom";
import DeleteIcon from "../drawable/outline_delete_24.svg";
import SaveIcon from "../drawable/baseline_check_24.svg";
import "./SourceEditor.scss";

type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;
type OwnProps = {};
const SourceEditor: React.FC<Props> = ({
  rmHostCategory,
  setHostCategory,
  addHostCategory,
  hosts,
}) => {
  let navigate = useNavigate();
  let location = useLocation();
  let idx = -1;
  let source: HostsCategory | undefined = undefined;
  if ((location.state as any)?.idx!==undefined) {
    idx = Number((location.state as any).idx);
    source = hosts.categories[idx];
  }
  let [category, setCategory] = React.useState<HostsCategory>(
    source
      ? source
      : {
          applyRedirects: false,
          content: [],
          enabled: true,
          format: "block",
          label: "",
          type: "url",
        }
  );

  let onSave = () => {
    if (idx < 0) {
      addHostCategory(category);
    } else {
      setHostCategory(idx, category);
    }
    navigate("/sources");
  };
  let onRemove = () => {
    rmHostCategory(idx);
    navigate("/sources");
  };
  let onLabelChange = (value: string) => {
    setCategory({ ...category, label: value });
  };
  let onTypeChange = (value: boolean) => {
    setCategory({ ...category, type: !value ? "file" : "url" });
  };
  let onFormatChange = (value: boolean) => {
    setCategory({ ...category, format: !value ? "allow" : "block" });
  };
  let onLocationChange = (value: string) => {
    setCategory({ ...category, location: value });
  };
  let onApplyRedirectsChange = () => {
    setCategory({ ...category, applyRedirects: !category.applyRedirects });
  };
  let editCategory=(c:HostsCategory)=>{
    setCategory({...c})
  }
  return (
    <div className="page source-editor">
      <SourceEditorHeader onSave={onSave} onRemove={onRemove} />
      <div className="wrapper">
        <TextInputStyled
          label={"Label"}
          value={category?.label}
          onChange={onLabelChange}
        />
        <SwitchStyled
          label={"List format"}
          value={category?.format === "block"}
          trueLabel="BLOCK"
          falseLabel="ALLOW"
          onChange={onFormatChange}
        />
        <SwitchStyled
          label={"Type"}
          value={category?.type === "url"}
          trueLabel="URL"
          falseLabel="FILE"
          onChange={onTypeChange}
        />
        {category?.type === "url" ? (
          <>
            <TextInputStyled
              label={"Location"}
              value={category?.location}
              onChange={onLocationChange}
            />
            <div className="checkBox">
              <input type="checkbox" onChange={onApplyRedirectsChange} />
              <div>Apply redirected hosts</div>
            </div>
            <div className="info">
              Allowing redirected hosts may cause security issues. Only use this
              on a trusted source as it could redirect some sensitive traffic to
              whatever server it wants
            </div>
          </>
        ) : (
          <>
            <div style={{ color: "var(--primary)" }}>Hosts</div>
            <div style={{border:"1px solid var(--text)",borderRadius:"5px",height:"100%"}}>
              <HostsFileEditor
                category={category}
                showAddButton={true}
                editable={true}
                onEdit={editCategory}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

type HProps = {
  children?: React.ReactNode;
  onSave(): void;
  onRemove(): void;
};
let SourceEditorHeader: React.FC<HProps> = ({ onSave, onRemove }) => {
  return (
    <Header backPage={"/sources"}>
      <div className="text">Edit source</div>
      <div className="buttonwrapper">
        <div className="button" onClick={onRemove}>
          <img src={DeleteIcon} />
        </div>
        <div className="button" onClick={onSave}>
          <img src={SaveIcon} />
        </div>
      </div>
    </Header>
  );
};
const mapDispatchToProps = {
  rmHostCategory: actions.rmHostCategory,
  addHostCategory: actions.addHostCategory,
  setHostCategory: actions.setHostCategory,
};

const mapStateToProps = (state: State) => {
  return { active: state.app.active, hosts: state.app.hosts };
};
export default connect(mapStateToProps, mapDispatchToProps)(SourceEditor);
