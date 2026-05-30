type ActionsProps = {
  onMarkAll: () => void;
  onReset: () => void;
  onPrint: () => void;
};

export function Actions({ onMarkAll, onReset, onPrint }: ActionsProps) {
  return (
    <div className="actions">
      <button className="btn btn-success" type="button" onClick={onMarkAll}>✅ Mark All Done</button>
      <button className="btn btn-danger" type="button" onClick={onReset}>🔄 Reset Chart</button>
      <button className="btn btn-print" type="button" onClick={onPrint}>🖨️ Print</button>
    </div>
  );
}
