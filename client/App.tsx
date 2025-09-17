import AppLayout from "./presenters/AppLayout";
import {
  RepoTabsContextProvider,
  UiSettingsContextProvider,
} from "./presenters/contexts";
import "./App.css";

export default function App() {
  return (
    <UiSettingsContextProvider>
      <RepoTabsContextProvider>
        <AppLayout />
      </RepoTabsContextProvider>
    </UiSettingsContextProvider>
  );
}
