/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import './Breadcrumbs.scss';

type BProps = {
  title: string;
  to: string;
};

const Breadcrumb: React.FC<BProps> = ({ title, to }) => {
  const navigate = useNavigate();
  const navigateBack = useCallback(() => {
    navigate(to);
  }, [to, navigate]);
  return (
    <>
      <div className="breadcrumb" onClick={navigateBack}>
        {title}
      </div>
      <div className="breadcrumb-separator">&#10217;</div>
    </>
  );
};
type Props = {
  title: string;
  history: { title: string; to: string }[];
};
const Breadcrumbs: React.FC<Props> = ({ title, history }) => {
  return (
    <h1 className="breadcrumbs">
      {history.map((h) => (
        <Breadcrumb key={h.title} title={h.title} to={h.to} />
      ))}
      {title}
    </h1>
  );
};
export default Breadcrumbs;
