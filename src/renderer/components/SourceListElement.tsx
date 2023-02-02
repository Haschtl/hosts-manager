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
        config?.type === 'url' ? '(Since 3 days up to date)' : ''
      }`}
      ItemEndComponent={
        <Switch defaultChecked={config?.enabled} onChange={toggleSource} />
      }
    />
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
