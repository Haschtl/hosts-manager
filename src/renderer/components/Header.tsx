import * as React from 'react';
import { useNavigate } from 'react-router';
import './Header.scss';

import BackIcon from '../../../assets/drawable/baseline_arrow_left.svg';

type Props = {
  children?: React.ReactNode;
  backPage?: string;
};
export const Header: React.FC<Props> = ({
  children = undefined,
  backPage = '/start',
}) => {
  const navigate = useNavigate();
  const goBack = React.useCallback(() => {
    navigate(backPage);
  }, [backPage, navigate]);
  return (
    <div className="page-header">
      <button type="button" onClick={goBack} className="button back-button">
        <img src={BackIcon} alt="Back" />
      </button>
      {children}
    </div>
  );
};

export default Header;
