import * as React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { Switch } from 'react-windows-ui';

import { State } from '../store/types';
import { HostsFile, SourceConfig } from '../../shared/types';
import * as actions from '../store/actions';
import ListItem from './ListItem';
import './SourceListElement.scss';

const numFormatter = (num: number) => {
  if (num < 1000) {
    return String(num);
  }
  return `${(num / 1000).toFixed(0)}k`;
};

export function timeSince(date: Date) {
  const dt = Date.now() - date.getTime();
  const seconds = Math.floor(dt / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} years`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} days`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes`;
  }
  return `${Math.floor(interval)} seconds`;
}

type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

type OwnProps = {
  source: HostsFile;
  config: SourceConfig;
};
const SourceListElement: React.FC<Props> = ({
  source,
  config,
  setHostsFile,
  setSourceConfig,
}) => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate('/editsource', {
      state: {
        id: config.id,
      },
    });
  };
  const toggleSource = React.useCallback(() => {
    setSourceConfig({ ...config, enabled: !config.enabled });
  }, [setSourceConfig, config]);
  return (
    // <div onClick={onClick}>
    <ListItem
      icon={config.type === 'url' ? 'icons10-download-2' : 'icons10-file'}
      color={config.format === 'block' ? 'danger' : 'success'}
      onClick={onClick}
      title={config?.label}
      subtitle={`${numFormatter(source.lines.length)} hosts ${
        source.mtime !== undefined
          ? `(Changed ${timeSince(new Date(source.mtime))} ago)`
          : ''
      }`}
      ItemEndComponent={
        <Switch defaultChecked={config?.enabled} onChange={toggleSource} />
      }
    >
      {config.comment !== undefined && config.comment !== '' ? (
        <p className="app-para-light app-mt-10 source-comment">
          {config.comment}
        </p>
      ) : (
        <></>
      )}
    </ListItem>
    // </div>
  );
};

const mapDispatchToProps = {
  setState: actions.setState,
  setHostsFile: actions.setHostsFile,
  setSourceConfig: actions.setSourceConfig,
};

const mapStateToProps = (state: State) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(SourceListElement);
