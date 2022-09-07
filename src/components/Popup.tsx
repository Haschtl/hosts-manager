import "./Popup.scss";

interface Props {
  isOpen?: boolean;
  children: React.ReactNode;
  onDismiss(): void;
}
let Popup: React.FC<Props> = ({ isOpen = false, onDismiss, children }) => {
  return (
    <div className={"popup " + (isOpen ? "visible" : "hidden")}>
      <div className="popup-background" onClick={onDismiss}>
        <div className="popup-content" onClick={(e)=>e.stopPropagation()}>{children}</div>
      </div>
    </div>
  );
};
export default Popup;
