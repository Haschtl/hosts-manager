import "./Popup.scss";

interface Props {
  isOpen?: boolean;
  children: React.ReactNode;
  onDismiss(): void;
}
let Popup: React.FC<Props> = ({ isOpen = false, onDismiss, children }) => {
  return (
    <div className="popup">
      <div className="popup-background" onClick={onDismiss}>
        <div className="popup-content">{children}</div>
      </div>
      ;
    </div>
  );
};
export default Popup;
