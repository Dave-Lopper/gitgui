
import AppLayout from "./presenters/AppLayout";
import { UiSettingsContextProvider } from "./presenters/contexts";
import "./App.css";

export default function App() {


  return (
    <UiSettingsContextProvider>
      <AppLayout />
    </UiSettingsContextProvider>
  );
}
