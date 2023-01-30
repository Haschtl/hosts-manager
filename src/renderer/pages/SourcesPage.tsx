import * as React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

import { Header } from '../components/Header';
import { State } from '../store/types';
import * as actions from '../store/actions';
import SourceListElement from '../components/SourceListElement';
import AddIcon from '../../../assets/drawable/ic_add_black_24px.svg';
import './SourcesPage.scss';

type HProps = {
  children?: React.ReactNode;
};
const SourcesHeader: React.FC<HProps> = () => {
  return (
    <Header>
      <div className="text">Hosts-Sources</div>
      <div className="buttonwrapper" />
    </Header>
  );
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const SourcesPage: React.FC<Props> = ({ hosts }) => {
  const navigate = useNavigate();
  const addSource = () => {
    navigate('/editsource', {
      state: {
        idx: -1,
      },
    });
  };
  return (
    <div className="page sources-page">
      <SourcesHeader />
      <div className="content">
        <div className="list">
          {hosts.categories.map((s, idx) => (
            <SourceListElement
              source={s}
              idx={idx}
              key={`category${s.label}`}
            />
          ))}
        </div>
        <button type="button" className="floating-button" onClick={addSource}>
          <img src={AddIcon} alt="add" />
        </button>
      </div>
    </div>
  );
};

// const mapDispatchToProps = (dispatch: any) =>
//   bindActionCreators({setState: actions.setState}, dispatch);
const mapDispatchToProps = {
  setState: actions.setState,
};

const mapStateToProps = (state: State) => {
  return { hosts: state.app.hosts };
};
export default connect(mapStateToProps, mapDispatchToProps)(SourcesPage);
