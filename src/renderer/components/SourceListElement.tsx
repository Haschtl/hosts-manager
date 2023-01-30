import * as React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

import { State } from '../store/types';
import { HostsCategory } from '../../shared/types';
import * as actions from '../store/actions';
import './SourceListElement.scss';
import { CheckBox } from './Inputs';

const numFormatter = (num: number) => {
  if (num < 1000) {
    return String(num);
  }
  return `${(num / 1000).toFixed(0)}k`;
};

type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

type OwnProps = {
  source: HostsCategory;
  idx: number;
};
const SourceListElement: React.FC<Props> = ({
  source,
  idx,
  setHostCategory,
}) => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate('/editsource', {
      state: {
        idx,
      },
    });
  };
  const toggleCategory = React.useCallback(() => {
    setHostCategory(idx, { ...source, enabled: !source.enabled });
  }, [idx, setHostCategory, source]);
  return (
    <button
      type="button"
      className="button source-list-element"
      onClick={onClick}
    >
      <CheckBox value={source.enabled} onChange={toggleCategory} />
      <div className="content">
        <div className="title">{source.label}</div>
        <div className="subtitle">{source.location}</div>
        {source.type === 'url' && (
          <div className="subsubtitle">Since 3 days up to date</div>
        )}
      </div>
      <div className="fixed">{numFormatter(source.content.length)} hosts</div>
    </button>
  );
};

const mapDispatchToProps = {
  setState: actions.setState,
  setHostCategory: actions.setHostCategory,
};

const mapStateToProps = (state: State) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(SourceListElement);
