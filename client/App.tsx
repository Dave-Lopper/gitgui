import { SplitPane } from "./containers";

function LeftPane() {
  return (
    <div>
      <h1>My left pane</h1>
      <p>Some text</p>
    </div>
  );
}

function RightPane() {
  return (
    <div>
      <h1>My right pane</h1>
      <p>Some more text</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="h-screen pt-20">
      <SplitPane rightPane={<RightPane />} leftPane={<LeftPane />}></SplitPane>
    </div>
  );
}
