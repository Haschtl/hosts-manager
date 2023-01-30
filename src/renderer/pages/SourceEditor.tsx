import * as React from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import { Header } from '../components/Header';
import { State } from '../store/types';
import { HostsCategory } from '../../shared/types';
import * as actions from '../store/actions';
import HostsFileEditor from '../components/HostsFileEditor';
import { SwitchStyled, TextInputStyled } from '../components/Inputs';
import DeleteIcon from '../../../assets/drawable/outline_delete_24.svg';
import SaveIcon from '../../../assets/drawable/baseline_check_24.svg';
import './SourceEditor.scss';

type HProps = {
  onSave(): void;
  onRemove(): void;
};
const SourceEditorHeader: React.FC<HProps> = ({ onSave, onRemove }) => {
  return (
    <Header backPage="/sources">
      <div className="text">Edit source</div>
      <div className="buttonwrapper">
        <button type="button" className="button" onClick={onRemove}>
          <img src={DeleteIcon} alt="delete" />
        </button>
        <button type="button" className="button" onClick={onSave}>
          <img src={SaveIcon} alt="save" />
        </button>
      </div>
    </Header>
  );
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const SourceEditor: React.FC<Props> = ({
  rmHostCategory,
  setHostCategory,
  addHostCategory,
  hosts,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  let idx = -1;
  let source: HostsCategory | undefined;
  if (location.state?.idx !== undefined) {
    idx = Number(location.state.idx);
    source = hosts.categories[idx];
  }
  const [category, setCategory] = React.useState<HostsCategory>(
    source || {
      applyRedirects: false,
      content: [],
      enabled: true,
      format: 'block',
      label: '',
      type: 'url',
    }
  );

  const onSave = React.useCallback(() => {
    if (idx < 0) {
      addHostCategory(category);
    } else {
      setHostCategory(idx, category);
    }
    navigate('/sources');
  }, [navigate, addHostCategory, idx, setHostCategory, category]);
  const onRemove = React.useCallback(() => {
    rmHostCategory(idx);
    navigate('/sources');
  }, [idx, navigate, rmHostCategory]);
  const onLabelChange = React.useCallback(
    (value: string) => {
      setCategory({ ...category, label: value });
    },
    [category]
  );
  const onTypeChange = React.useCallback(
    (value: boolean) => {
      setCategory({ ...category, type: !value ? 'file' : 'url' });
    },
    [category]
  );
  const onFormatChange = React.useCallback(
    (value: boolean) => {
      setCategory({ ...category, format: !value ? 'allow' : 'block' });
    },
    [category]
  );
  const onLocationChange = React.useCallback(
    (value: string) => {
      setCategory({ ...category, location: value });
    },
    [category]
  );
  const onApplyRedirectsChange = () => {
    setCategory({ ...category, applyRedirects: !category.applyRedirects });
  };
  const editCategory = React.useCallback((c: HostsCategory) => {
    setCategory({ ...c });
  }, []);
  return (
    <div className="page source-editor">
      <SourceEditorHeader onSave={onSave} onRemove={onRemove} />
      <div className="wrapper">
        <TextInputStyled
          label="Label"
          value={category?.label}
          onChange={onLabelChange}
        />
        <SwitchStyled
          label="List format"
          value={category?.format === 'block'}
          trueLabel="BLOCK"
          falseLabel="ALLOW"
          onChange={onFormatChange}
        />
        <SwitchStyled
          label="Type"
          value={category?.type === 'url'}
          trueLabel="URL"
          falseLabel="FILE"
          onChange={onTypeChange}
        />
        {category?.type === 'url' ? (
          <>
            <TextInputStyled
              label="Location"
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
            <div style={{ color: 'var(--primary)' }}>Hosts</div>
            <div
              style={{
                border: '1px solid var(--text)',
                borderRadius: '5px',
                height: '600px',
              }}
            >
              <HostsFileEditor
                category={category}
                showAddButton
                editable
                onEdit={editCategory}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  rmHostCategory: actions.rmHostCategory,
  addHostCategory: actions.addHostCategory,
  setHostCategory: actions.setHostCategory,
};

const mapStateToProps = (state: State) => {
  return { hosts: state.app.hosts };
};
export default connect(mapStateToProps, mapDispatchToProps)(SourceEditor);
