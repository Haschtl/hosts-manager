import { useCallback } from 'react';
import { useLocation } from 'react-router';
import { connect } from 'react-redux';
import { InputSearchBox } from 'react-windows-ui';
import { State } from '../store/types';
import * as actions from '../store/actions';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

export const filterAny = (searchText?: string) => (data: unknown) => {
  let compareString: string;
  if (searchText === undefined || searchText === '') {
    return true;
  }
  if (typeof data === 'object') {
    compareString = JSON.stringify(data);
  } else {
    compareString = String(data);
  }
  return compareString.toLowerCase().includes(searchText.toLowerCase());
};
const GlobalSearch: React.FC<Props> = ({ searchText, setSearchText }) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    [setSearchText]
  );
  const location = useLocation();
  const isSearchAvailable =
    location.pathname.startsWith('/profile/') ||
    location.pathname.startsWith('/firewall') ||
    location.pathname.startsWith('/dns') ||
    location.pathname.startsWith('/editsource') ||
    location.pathname.startsWith('/list');
  return (
    <div
      className={`search-wrapper ${isSearchAvailable ? 'visible' : 'hidden'}`}
    >
      <InputSearchBox value={searchText} onChange={onChange} />
    </div>
  );
};

const mapDispatchToProps = {
  setSearchText: actions.setSearchText,
};
const mapStateToProps = (state: State) => {
  return { searchText: state.app.searchText };
};
export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearch);
