import * as React from 'react';
import './ListItem.scss';

type IProps = {
  imgSrc?: string;
  icon?: string;
  enabled?: boolean;
  title?: string;
  color?: 'success' | 'danger';
  subtitle?: string;
  ItemEndComponent?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?(e?: React.MouseEvent): void;
};
const ListItem: React.FC<IProps> = ({
  enabled = true,
  imgSrc,
  icon,
  title,
  color,
  subtitle,
  children,
  ItemEndComponent,
  className = 'app-section-container-fg item-container',
  onClick,
}) => {
  const [rerender, setRerender] = React.useState(false);
  const forceRerender = React.useCallback(() => {
    setRerender(true);
    setTimeout(() => {
      setRerender(false);
    }, 10);
  }, []);
  const onClickInternal = React.useCallback(() => {
    if (onClick) {
      onClick();
      forceRerender();
    }
  }, [onClick, forceRerender]);
  let iconComponent: React.ReactNode;
  if (imgSrc !== undefined) {
    iconComponent = <img className="settings-icon" src={imgSrc} alt="icon" />;
  } else if (icon !== undefined) {
    iconComponent = <i className={`settings-icon ${icon} color-${color}`} />;
  } else {
    iconComponent = <div className="settings-icon" />;
  }
  return (
    <div
      className={`${className} ${onClick !== undefined ? 'clickable' : ''} ${
        enabled ? 'enabled' : 'disabled'
      }`}
      onClick={onClickInternal}
    >
      <div className="item-outer">
        <div className="item-wrapper">
          <div className="item-content">
            {iconComponent}
            <div className="item-content-inner">
              <div className="item-title">{title}</div>
              <p className="item-subtitle app-m-0 app-para-light">{subtitle}</p>
            </div>
          </div>
          {ItemEndComponent && !rerender && (
            <div className="item-end" onClick={(e) => e.stopPropagation()}>
              {ItemEndComponent}
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
export default ListItem;
