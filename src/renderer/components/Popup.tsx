import { useCallback } from 'react';
import './Popup.scss';

interface Props {
  isOpen?: boolean;
  children: React.ReactNode;
  onDismiss(): void;
}
const Popup: React.FC<Props> = ({ isOpen = false, onDismiss, children }) => {
  const onKeyPressHandler: React.KeyboardEventHandler = useCallback(
    (event) => {
      if (event.key === 'Esc') {
        onDismiss();
      }
    },
    [onDismiss]
  );

  return (
    <div className={`popup ${isOpen ? 'visible' : 'hidden'}`}>
      <div
        onKeyDown={onKeyPressHandler}
        role="button"
        className="popup-background"
        tabIndex={0}
        onClick={onDismiss}
      >
        <div
          role="button"
          onKeyDown={onKeyPressHandler}
          tabIndex={0}
          className="popup-content"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
export default Popup;
