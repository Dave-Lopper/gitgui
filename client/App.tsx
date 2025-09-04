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

function Divider() {
  return (
    <div className="h-full w-1 cursor-col-resize bg-white transition-colors duration-300 hover:bg-blue-500"></div>
  );
}

export default function App() {
  return (
    <div className="h-screen">
      <SplitPane
        divider={<Divider />}
        rightPane={<RightPane />}
        leftPane={<LeftPane />}
      ></SplitPane>
    </div>
  );
}
