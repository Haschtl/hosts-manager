/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  NavPageContainer,
  CommandBar,
  Dialog,
  Button,
  Select,
} from 'react-windows-ui';

import { State } from '../store/types';
import * as actions from '../store/actions';
import SourceListElement from '../components/SourceListElement';
import './SourcesPage.scss';
import { getSource, getUniqueID } from '../../shared/helper';
import { SourceConfig } from '../../shared/types';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const SourcesPage: React.FC<Props> = ({
  sources,
  sourcesConfig,
  sourceTemplates,
  setSourceConfig,
}) => {
  const navigate = useNavigate();
  const [addDialogVisible, setAddDialogVisible] = React.useState<string>();
  const hideAddDialogVisible = React.useCallback(() => {
    setAddDialogVisible(undefined);
  }, []);
  const showAddDialogVisible = React.useCallback(() => {
    setAddDialogVisible('empty');
  }, []);
  const onTemplateChange = React.useCallback((e: string) => {
    setAddDialogVisible(e);
  }, []);
  const addSource = React.useCallback(() => {
    const id = getUniqueID(sourcesConfig);
    const selection = sourceTemplates.find(
      (st) => st.label === addDialogVisible
    );
    const template: SourceConfig = {
      id,
      enabled: true,
      location: `./sources/${selection?.label?.replaceAll(' ', '_')}.hosts`,
      ...selection,
    } as SourceConfig;
    setSourceConfig(template);
    setTimeout(() => {
      navigate('/editsource', {
        state: {
          id,
        },
      });
    }, 200);
  }, [
    navigate,
    addDialogVisible,
    sourceTemplates,
    sourcesConfig,
    setSourceConfig,
  ]);
  const sortedSources = sourcesConfig.sources;
  sortedSources.sort((a, b) => (a.label > b.label ? 1 : -1));
  return (
    <NavPageContainer animateTransition>
      <Dialog
        // @ts-ignore
        style={{ overflow: 'visible' }}
        isVisible={addDialogVisible !== undefined}
        onBackdropPress={hideAddDialogVisible}
      >
        {/* @ts-ignore */}
        <Dialog.Header>
          <h3>Add source</h3>
          {/* @ts-ignore */}
        </Dialog.Header>
        {/* @ts-ignore */}
        <Dialog.Body style={{ padding: 20, overflow: 'visible' }}>
          <p>
            You can add pre-defined online sources or create your custom ones.
          </p>
          <Select
            defaultValue={addDialogVisible} // Optional
            // @ts-ignore
            onChange={onTemplateChange}
            data={
              [
                { label: 'Empty template', value: 'empty' },
                ...sourceTemplates.map((st) => ({
                  label: st.label,
                  value: st.label,
                })),
              ] as unknown as string[]
            }
          />
          {/* @ts-ignore */}
        </Dialog.Body>
        {/* @ts-ignore */}
        <Dialog.Footer>
          <Button value="Abort" type="danger" onClick={hideAddDialogVisible} />
          <Button value="Create" type="success" onClick={addSource} />
          {/* @ts-ignore */}
        </Dialog.Footer>
      </Dialog>
      <div className="page sources-page">
        <h1>Sources</h1>
        <CommandBar>
          {/* @ts-ignore */}
          <CommandBar.Button
            value="New"
            onClick={showAddDialogVisible}
            icon={<i className="icons10-plus color-primary" />}
          />
        </CommandBar>
        <p>
          Include hosts-files from multiple locations. Each hosts-file is one
          group.
        </p>
        <div className="content">
          <div className="list">
            {sortedSources.length === 0 ? (
              <p>Add some sources for your first profile</p>
            ) : (
              <>
                {sourcesConfig.sources.map((c) => (
                  <SourceListElement
                    source={getSource(c, sources)}
                    config={c}
                    key={`source${c.label}`}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </NavPageContainer>
  );
};

const mapDispatchToProps = {
  setState: actions.setState,
  setSourceConfig: actions.setSourceConfig,
};

const mapStateToProps = (state: State) => {
  return {
    sources: state.app.sources,
    sourcesConfig: state.app.sourcesConfig,
    sourceTemplates: state.app.sourceTemplates,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SourcesPage);
