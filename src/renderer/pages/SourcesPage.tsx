/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  NavPageContainer,
  CommandBar,
  Dialog,
  Button,
  LoaderBar,
  Select,
  InputText,
} from 'react-windows-ui';

import { State } from '../store/types';
import * as actions from '../store/actions';
import SourceListElement from '../components/SourceListElement';
import './SourcesPage.scss';
import { getSource, getUniqueID, annotateSources } from '../../shared/helper';
import { SourceConfig } from '../../shared/types';
import ListItem from '../components/ListItem';
import { sortHosts } from '../store/selectors';
import RedirectedIcon from '../../../assets/icons/redirect_24.svg';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const SourcesPage: React.FC<Props> = ({
  sources,
  sourcesConfig,
  sourceTemplates,
  settings,
  setHostsFile,
  setSourceConfig,
  setProfiles,
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
  const [loading, setLoading] = React.useState<string>();

  const onlineSources = sourcesConfig.sources.filter(
    (s) =>
      s.type === 'url' &&
      s.url !== undefined &&
      s.url !== '' &&
      s.location !== '' &&
      s.location !== undefined
  );
  const scs = onlineSources.filter((s) => s.enabled);
  const updateSources = (e: React.MouseEvent) => {
    if (scs.length === 0) {
      return;
    }
    e.stopPropagation();
    setLoading(`Downloading ${scs.length} sources`);

    window.taskbar.progress(2);
    scs.forEach(async (s, idx) => {
      const f = await window.files.downloadFile(s.url!, s.location);

      setLoading(`Downloaded ${s.label}...`);
      if (f) {
        setHostsFile(f);
      }
      if (idx === scs.length - 1) {
        setLoading(undefined);
        window.taskbar.progress(0);
      }
    });
    window.files.notify('Updating sources');
  };
  const sorted = sortHosts(
    annotateSources(sources, sourcesConfig),
    settings.ipv6
  );
  const [profileName, setProfileName] = React.useState('');
  const [profileInputVisible, setProfileInputVisible] = React.useState(false);
  const hideProfileInput = React.useCallback(() => {
    setProfileInputVisible(false);
    setProfileName('');
  }, []);
  const showProfileInput = React.useCallback((e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    setProfileInputVisible(true);
    setProfileName('');
  }, []);
  const onProfileNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfileName(e.target.value);
    },
    []
  );
  const createProfile = React.useCallback(() => {
    const name = profileName;
    hideProfileInput();
    setLoading('Creating profile...');
    window.taskbar.progress(2);
    window.files
      .saveHostsFile(
        sources,
        sourcesConfig,
        `./profiles/${name}.hosts`,
        settings.ipv6,
        settings.blockedHostOverwrite,
        settings.removeComments
      )
      .then(async () => {
        const profileFiles = await window.files.loadProfiles();

        if (profileFiles) {
          setProfiles(profileFiles);
        }
        setLoading(undefined);
        navigate('/');
        return window.taskbar.progress(0);
      })
      .catch((e) => console.log(e));
  }, [
    settings.ipv6,
    settings.blockedHostOverwrite,
    settings.removeComments,
    sources,
    profileName,
    sourcesConfig,
    setProfiles,
    navigate,
    hideProfileInput,
  ]);
  return (
    <NavPageContainer animateTransition>
      <Dialog
        isVisible={profileInputVisible}
        onBackdropPress={hideProfileInput}
      >
        {/* @ts-ignore */}
        <Dialog.Header>
          <h3>Create profile</h3>
          {/* @ts-ignore */}
        </Dialog.Header>
        {/* @ts-ignore */}
        <Dialog.Body style={{ padding: 20 }}>
          <p>Specify a profile name.</p>
          <InputText
            value={profileName}
            onChange={onProfileNameChange}
            label="Profilename"
            placeholder="My profile"
          />
          {/* @ts-ignore */}
        </Dialog.Body>
        {/* @ts-ignore */}
        <Dialog.Footer>
          <Button value="Abort" type="danger" onClick={hideProfileInput} />
          <Button value="Create" type="success" onClick={createProfile} />
          {/* @ts-ignore */}
        </Dialog.Footer>
      </Dialog>
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
            <ListItem
              onClick={() => navigate('/list')}
              ItemEndComponent={
                <>
                  <Button
                    icon={<i className="icons10-refresh" />}
                    style={{ margin: 1, height: '40px', width: '40px' }}
                    onClick={updateSources}
                    value=""
                    disabled={scs.length === 0}
                    tooltip="Fetch online sources"
                  />
                  <Button
                    value="Create profile"
                    style={{ height: '40px' }}
                    onClick={showProfileInput}
                  />
                </>
              }
              icon="icons10-bookmark"
              title="Current selection"
              subtitle={`${
                sourcesConfig.sources.filter((sc) => sc.enabled).length
              }/${sourcesConfig.sources.length} sources (${
                onlineSources.filter((sc) => sc.enabled).length
              }/${onlineSources.length} online)`}
            >
              <div className="profile-statistics">
                <ListItem
                  title={String(sorted.blocked.length)}
                  subtitle="Blocked"
                  icon="icons10-cancel color-danger"
                />
                <ListItem
                  title={String(sorted.allowed.length)}
                  subtitle="Allowed"
                  icon="icons10-checkmark color-success"
                />
                <ListItem
                  title={String(sorted.redirected.length)}
                  subtitle="Redirected"
                  imgSrc={RedirectedIcon}
                />
              </div>
              {sorted.redirected.length + sorted.blocked.length > 100000 ? (
                <div>
                  <p className="color-danger">
                    This hosts-file may be very long (&gt;100000) entries.
                    Windows can not handle large hosts-files. Consider using a{' '}
                    <a
                      href="https://technitium.com/dns/"
                      rel="noreferrer"
                      target="_blank"
                    >
                      local DNS-Server
                    </a>{' '}
                    for better performance with large block-lists.
                  </p>
                </div>
              ) : null}
              <div className="update-bar">
                <div
                  className={`updates-available ${
                    loading !== undefined ? ' visible' : ''
                  }`}
                >
                  {loading}
                </div>
                <LoaderBar isLoading={loading !== undefined} />
              </div>
            </ListItem>
            <br />
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
  setProfiles: actions.setProfiles,
  setHostsFile: actions.setHostsFile,
};

const mapStateToProps = (state: State) => {
  return {
    sources: state.app.sources,
    sourcesConfig: state.app.sourcesConfig,
    sourceTemplates: state.app.sourceTemplates,
    settings: state.app.settings,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SourcesPage);
