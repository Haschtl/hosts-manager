/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { NavPageContainer, CommandBar } from 'react-windows-ui';

import { State } from '../store/types';
import * as actions from '../store/actions';
import SourceListElement from '../components/SourceListElement';
import './SourcesPage.scss';
import { getSource, getSourceConfig } from '../../shared/helper';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const SourcesPage: React.FC<Props> = ({ sources, sourcesConfig }) => {
  const navigate = useNavigate();
  const addSource = React.useCallback(() => {
    navigate('/editsource', {
      state: {
        idx: -1,
      },
    });
  }, [navigate]);
  return (
    <NavPageContainer animateTransition>
      <div className="page sources-page">
        <h1>Sources</h1>
        <CommandBar>
          {/* @ts-ignore */}
          <CommandBar.Button
            value="New"
            onClick={addSource}
            icon={<i className="icons10-plus color-primary" />}
          />
        </CommandBar>
        <p>
          Include hosts-files from multiple locations. Each hosts-file is one
          group.
        </p>
        <div className="content">
          <div className="list">
            {sourcesConfig.sources.map((c) => (
              <SourceListElement
                source={getSource(c, sources)}
                config={c}
                key={`source${c.label}`}
              />
            ))}
          </div>
        </div>
      </div>
    </NavPageContainer>
  );
};

// const mapDispatchToProps = (dispatch: any) =>
//   bindActionCreators({setState: actions.setState}, dispatch);
const mapDispatchToProps = {
  setState: actions.setState,
};

const mapStateToProps = (state: State) => {
  return { sources: state.app.sources, sourcesConfig: state.app.sourcesConfig };
};
export default connect(mapStateToProps, mapDispatchToProps)(SourcesPage);
