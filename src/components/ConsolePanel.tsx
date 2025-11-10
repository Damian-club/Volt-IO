type Props = {
  logs: string[];
};

export default function ConsolePanel({ logs }: Props) {
  return (
    <div id="console">
      <h3>Console</h3>
      <div className="console-output">
        {logs.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          logs.map((msg, i) => <div key={i}>{msg}</div>)
        )}
      </div>
    </div>
  );
}
