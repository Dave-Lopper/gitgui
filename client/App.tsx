import RetroSoundOffIcon from "./icons/retro/SoundOff";
import { UiSettingsContextProvider } from "./presenters/contexts";
import { Dropdown, SelectDropdown, SplitPane } from "./presenters/headless";
import RetroButton from "./presenters/themed/retro/Button";
import "./App.css";
import { useState } from "react";
import RetroRepositoryDropdown from "./presenters/themed/retro/RepoSelectionDropdown";
import Header from "./presenters/headless/Header";
import RetroBranchDropdown from "./presenters/themed/retro/BranchSelectionDropdown";
import RetroSettingsMenu from "./presenters/themed/retro/SettingsMenu";

// function LeftPane() {
//   return (
//     <div className="flex h-screen w-full items-start justify-start">
//       <SelectDropdown
//         animate
//         children={options.map((option) => (isSelected: boolean) => (
//           <Option isSelected={isSelected} text={option} key={option} />
//         ))}
//         handleSelect={(val: number | null) => console.log({ val })}
//         trigger={Trigger}
//       />
//     </div>
//   );
// }

// function RightPane() {
//   return (
//     <div className="flex h-screen w-full items-start justify-start">
//       <Dropdown
//         animate
//         className="w-3/5"
//         children={
//           <div className="w-full bg-gray-300">
//             <h2>Select branch</h2>
//           </div>
//         }
//         trigger={Trigger2}
//       />
//     </div>
//   );
// }

// function Divider() {
//   return (
//     <div className="h-full w-1 cursor-col-resize bg-white transition-colors duration-300 hover:bg-blue-500"></div>
//   );
// }

// function Trigger({ isFocused }: { isFocused: boolean }) {
//   return (
//     <div
//       className={`flex w-full cursor-pointer items-center justify-center p-2 text-black ${isFocused ? "bg-blue-400" : "bg-gray-200"}`}
//     >
//       <p style={{ fontFamily: "Microsoft Sans Serif" }}>Select repository</p>
//     </div>
//   );
// }

// function Trigger2({ isFocused }: { isFocused: boolean }) {
//   return (
//     <div
//       className={`flex w-full cursor-pointer items-center justify-center p-4 text-black ${isFocused ? "bg-blue-400" : "bg-gray-200"}`}
//     >
//       <p>Select branch</p>
//     </div>
//   );
// }

// function Option({ text, isSelected }: { text: string; isSelected?: boolean }) {
//   return (
//     <div
//       className={`flex w-full items-center justify-center ${isSelected ? `bg-blue-400` : `bg-gray-200`} cursor-pointer p-4 text-black`}
//     >
//       <p>{text}</p>
//     </div>
//   );
// }

// const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

// export default function App() {
//   return (
//     <UiSettingsContextProvider>
//       <div className="flex h-screen w-screen items-start justify-start">
//         <SplitPane
//           rightPane={<RightPane />}
//           leftPane={<LeftPane />}
//           divider={<Divider />}
//         />
//       </div>
//     </UiSettingsContextProvider>
//   );
// }

export default function App() {
  const [isActive, setIsActive] = useState(false);
  return (
    <UiSettingsContextProvider>
      <div className="bg-retro flex h-screen w-screen items-center justify-center">
        <Header
          branchDropdown={<RetroBranchDropdown />}
          repositoryDropdown={<RetroRepositoryDropdown />}
          uiSettings={<RetroSettingsMenu />}
        />
      </div>
    </UiSettingsContextProvider>
  );
}
