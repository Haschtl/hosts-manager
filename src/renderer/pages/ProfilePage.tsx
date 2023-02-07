/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavPageContainer, CommandBar, LoaderBusy } from 'react-windows-ui';

import { State } from '../store/types';
import HostsFileEditor from '../components/HostsFileEditor';
import * as actions from '../store/actions';

import { path2profilename } from '../../shared/helper';
import { HostsFile } from '../../shared/types';
import Breadcrumbs from '../components/Breadcrumbs';
// import './ListViewPage.scss';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
const ProfilePage: React.FC<Props> = ({
  profiles,
  systemHosts,
  setProfiles,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  let profile: HostsFile = { lines: [], path: '' };
  let id: string;
  if (location.pathname === '/system') {
    profile = systemHosts;
    id = 'System hosts';
  } else {
    id = location.pathname.split('/')[2].replaceAll('%20', ' ');
    const tempProfile = profiles.find((p) => path2profilename(p.path) === id);
    if (tempProfile) {
      profile = tempProfile;
    }
  }
  const [hostsFile, setHostsFile2] = React.useState<HostsFile>({
    ...profile,
    lines: [...profile.lines],
  });
  const [loading, setLoading] = React.useState(false);
  const removeProfile = React.useCallback(() => {
    window.taskbar.progress(2);
    setLoading(true);
    window.files
      .removeProfile(hostsFile.path)
      .then((p) => {
        if (p) {
          setLoading(false);
          window.taskbar.progress(0);
          setProfiles(p);
        }
        return undefined;
      })
      .catch((ev) => console.log(ev));
  }, [hostsFile.path, setProfiles]);
  const onSave = React.useCallback(() => {
    setLoading(true);
    return window.files
      .saveHostsFile(
        { files: [hostsFile] },
        {
          sources: [
            {
              location: hostsFile.path,
              id: -1,
              label: 'profile',
              format: 'block',
              type: 'file',
              enabled: true,
              applyRedirects: true,
            },
          ],
        },
        hostsFile.path
      )
      .then(() => {
        return window.files.loadProfiles().then((p) => {
          if (p) {
            setProfiles(p);
            return navigate('/');
            // return setHostsFile(hostsFile);
          }
          return undefined;
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, hostsFile, setProfiles]);
  const onRemove = React.useCallback(() => {
    removeProfile();
    navigate('/');
  }, [navigate, removeProfile]);
  const addLine = React.useCallback(() => {
    hostsFile.lines = [
      { enabled: true, host: '0.0.0.0', domain: 'example.com' },
      ...hostsFile.lines,
    ];
    setHostsFile2({ lines: hostsFile.lines, path: hostsFile.path });
  }, [hostsFile]);
  const editHostsFile = React.useCallback((c: HostsFile) => {
    setHostsFile2({ ...c });
  }, []);
  // const sorted = sortHosts(hostsFile2sources(hostsFile), settings.ipv6);
  // const [filter, setFilter] = React.useState<{
  //   blocked: boolean;
  //   allowed: boolean;
  //   redirected: boolean;
  // }>({
  //   blocked: false,
  //   allowed: false,
  //   redirected: false,
  // });
  // const toggleFilterBlocked = React.useCallback(() => {
  //   setFilter({ ...filter, blocked: !filter.blocked });
  // }, [filter]);
  // const toggleFilterRedirected = React.useCallback(() => {
  //   setFilter({ ...filter, redirected: !filter.redirected });
  // }, [filter]);
  // const toggleFilterAllowed = React.useCallback(() => {
  //   setFilter({ ...filter, allowed: !filter.allowed });
  // }, [filter]);
  return (
    <NavPageContainer animateTransition>
      <div className="page list">
        <LoaderBusy isLoading={loading} display="overlay" />
        <Breadcrumbs
          history={[{ title: 'Profiles', to: '/index.html' }]}
          title={id}
        />
        <CommandBar>
          {/* @ts-ignore */}
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
          {/* @ts-ignore */}
          <CommandBar.Button
            value="Add"
            onClick={addLine}
            icon={<i className="icons10-plus color-success" />}
          />
        </CommandBar>
        <p>This list represents the selected profile</p>
        {/* <h3>{title}</h3> */}
        <div className="content">
          <HostsFileEditor
            // file={{
            // lines: [
            //   ...(filter.allowed ? [] : sorted.allowed),
            //   ...(filter.redirected ? [] : sorted.redirected),
            //   ...(filter.blocked ? [] : sorted.blocked),
            // ],
            //   path: 'block',
            // }}
            file={hostsFile}
            editable={id !== 'System hosts'}
            onEdit={editHostsFile}
          />
        </div>
      </div>
    </NavPageContainer>
  );
};
const mapDispatchToProps = {
  setProfiles: actions.setProfiles,
  // setHostsFile: actions.setHostsFile,
};

const mapStateToProps = (state: State) => {
  return {
    profiles: state.app.profiles,
    systemHosts: state.app.systemHosts,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
