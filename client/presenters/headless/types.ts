import { ChangeEvent } from "react";

export type CheckboxProps = {
  className?: string;
  isChecked: boolean;
  onClick: () => void;
};

export type ContextualAction = "REFRESH" | "PULL" | "PUSH" | null;

export type LabelProps = { text: string };

export type TextInputProps = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  secret?: boolean;
  placeholder?: string;
  value?: string;
};

export type ThemedContextualMenuProps = {
  contextualAction: ContextualAction;
  isFetchLoading: boolean;
  onActionClick: () => Promise<void>;
  pullCount?: number;
  pushCount?: number;
};

export type SubmitButtonProps = {
  disabled: boolean;
  text: string;
  onClick: () => Promise<void>;
};
