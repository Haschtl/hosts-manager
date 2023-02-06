/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import {
  NavPageContainer,
  CommandBar,
  InputText,
  Select,
  Button,
  Switch,
} from 'react-windows-ui';

import { State } from '../store/types';
import * as actions from '../store/actions';
import HostsFileEditor from '../components/HostsFileEditor';
import Breadcrumbs from '../components/Breadcrumbs';
import ListItem from '../components/ListItem';
import { HostsFile, SourceConfig } from '../../shared/types';
import { getSource, getUniqueID } from '../../shared/helper';
import './SourceEditor.scss';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const SourceEditor: React.FC<Props> = ({
  rmSource,
  setHostsFile,
  sourcesConfig,
  sources,
  setSourceConfig,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  let id = -1;
  let sourceConfig: SourceConfig | undefined;
  let hosts: HostsFile | undefined;
  if (location.state?.id !== undefined) {
    id = Number(location.state.id);
    sourceConfig = sourcesConfig.sources.find((s) => s.id === id);
    if (sourceConfig) {
      hosts = getSource(sourceConfig, sources);
    }
  }
  const [config, setConfig] = React.useState<SourceConfig>(
    sourceConfig || {
      applyRedirects: false,
      enabled: true,
      format: 'block',
      label: '',
      type: 'url',
      location: '',
      id: getUniqueID(sourcesConfig),
    }
  );
  const [hostsFile, setHostsFile2] = React.useState<HostsFile>(
    hosts || {
      lines: [],
      path: config.location,
    }
  );

  const onSave = React.useCallback(() => {
    setHostsFile(hostsFile);
    setSourceConfig(config);
    navigate('/sources');
  }, [navigate, setHostsFile, config, hostsFile, setSourceConfig]);
  const onRemove = React.useCallback(() => {
    rmSource(id);
    navigate('/sources');
  }, [id, navigate, rmSource]);
  const onLabelChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        sourceConfig?.location === undefined ||
        sourceConfig?.location === ''
      ) {
        const path = `./sources/${e.target.value}.hosts`;
        setConfig({
          ...config,
          label: e.target.value,
          location: path,
        });
        setHostsFile2({ ...hostsFile, path });
      } else {
        setConfig({ ...config, label: e.target.value });
      }
    },
    [config, sourceConfig, setHostsFile2, hostsFile]
  );
  const onCommentChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfig({ ...config, comment: e.target.value });
    },
    [config]
  );
  const onTypeChange = React.useCallback(
    (value: 'url' | 'file') => {
      setConfig({ ...config, type: value });
    },
    [config]
  );
  const onFormatChange = React.useCallback(
    (e: 'block' | 'allow') => {
      setConfig({ ...config, format: e });
    },
    [config]
  );
  const unURLChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfig({ ...config, url: e.target.value });
    },
    [config]
  );
  const onApplyRedirectsChange = () => {
    setConfig({ ...config, applyRedirects: !config.applyRedirects });
  };
  const editHostsFile = React.useCallback((c: HostsFile) => {
    setHostsFile2({ ...c });
  }, []);

  const addLine = React.useCallback(() => {
    hostsFile.lines = [
      { enabled: true, host: '0.0.0.0', domain: 'example.com' },
      ...hostsFile.lines,
    ];
    setHostsFile2({ lines: hostsFile.lines, path: hostsFile.path });
  }, [hostsFile]);
  const [loading, setLoading] = React.useState(false);
  const downloadSource = React.useCallback(() => {
    if (config.url && config.url !== '') {
      setLoading(true);
      window.taskbar.progress(2);
      return window.files
        .downloadFile(config.url, config.location)
        .then((b) => {
          if (b) {
            setHostsFile(b);
          }
          return b;
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);

          window.taskbar.progress(0);
        });
    }
    return undefined;
  }, [config.url, config.location, setHostsFile]);
  return (
    <NavPageContainer animateTransition>
      <div className="page source-editor">
        <Breadcrumbs
          title={
            config.label !== undefined && config.label !== ''
              ? config.label
              : 'New'
          }
          history={[{ title: 'Sources', to: '/sources' }]}
        />
        <CommandBar>
          {/* @ts-ignore */}
          <CommandBar.Button
            onClick={onSave}
            value="Save"
            icon={<i className="icons10-checkmark color-success" />}
          />

          {/* @ts-ignore */}
          <CommandBar.SplitDivider />
          {/* @ts-ignore */}
          <CommandBar.Button
            onClick={onRemove}
            value="Delete"
            icon={<i className="icons10-cross color-danger" />}
          />
        </CommandBar>
        <p>Modify or create a new source.</p>

        <ListItem
          title="Label"
          subtitle="Name of this source group."
          ItemEndComponent={
            <InputText
              placeholder="Source label"
              value={config?.label}
              onChange={onLabelChange}
            />
          }
        />
        <ListItem
          title="Comment"
          subtitle="A comment describing this group."
          ItemEndComponent={
            <InputText
              placeholder="Comment..."
              value={config?.comment}
              onChange={onCommentChange}
            />
          }
        />
        <ListItem
          title="Type"
          subtitle="Specify if hosts in this list should be blocked or allowed (whitelisted)"
          ItemEndComponent={
            <Select
              defaultValue={config.format} // Optional
              // @ts-ignore
              onChange={onFormatChange}
              data={
                [
                  { label: 'Block', value: 'block' },
                  { label: 'Allow', value: 'allow' },
                ] as unknown as string[]
              }
            />
          }
        />
        <ListItem
          title="Source-type"
          subtitle="Specify the type of this source. Online sources or local files are available."
          ItemEndComponent={
            <Select
              defaultValue={config?.type} // Optional
              // @ts-ignore
              onChange={onTypeChange}
              data={
                [
                  { label: 'Online', value: 'url' },
                  { label: 'Local', value: 'file' },
                ] as unknown as string[]
              }
            />
          }
        />
        {config.type === 'url' && (
          <>
            <ListItem
              onClick={onApplyRedirectsChange}
              title="Allow Redirects"
              subtitle="Specify if redirects are allowed in this group. If not, all IPs will be redirected to 0.0.0.0.
                Allowing redirected hosts may cause security issues. Only use
                this on a trusted source as it could redirect some sensitive
                traffic to whatever server it wants"
              ItemEndComponent={
                <Switch
                  disabled={config?.type !== 'url'}
                  labelOn="On"
                  labelOff="Off"
                  onChange={onApplyRedirectsChange}
                  defaultChecked={config.applyRedirects}
                  labelPosition="start"
                />
              }
            />
            <ListItem
              title="Location"
              subtitle="URL of the online source."
              ItemEndComponent={
                <InputText
                  disabled={config?.type !== 'url'}
                  placeholder="URL"
                  value={config?.url}
                  onChange={unURLChange}
                />
              }
            />
          </>
        )}
        <ListItem
          title="Entries"
          subtitle="Hosts entries of this group"
          ItemEndComponent={
            config?.type !== 'url' ? (
              <Button value="Add" onClick={addLine} />
            ) : (
              <Button
                value="Download"
                onClick={downloadSource}
                isLoading={loading}
              />
            )
          }
        >
          <div
            style={{
              border: '1px solid var(--text)',
              borderRadius: '5px',
              height: '600px',
            }}
          >
            <HostsFileEditor
              file={config.type === 'url' ? hosts : hostsFile}
              editable={config.type === 'file'}
              onEdit={editHostsFile}
            />
          </div>
        </ListItem>
      </div>
    </NavPageContainer>
  );
};

const mapDispatchToProps = {
  rmSource: actions.rmSource,
  setHostsFile: actions.setHostsFile,
  setSourceConfig: actions.setSourceConfig,
};

const mapStateToProps = (state: State) => {
  return { sourcesConfig: state.app.sourcesConfig, sources: state.app.sources };
};
export default connect(mapStateToProps, mapDispatchToProps)(SourceEditor);
