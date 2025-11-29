import { ChangeEvent, ReactNode } from "react";

import { Commit } from "../../domain/commit";

export type CheckboxProps = {
  className?: string;
  isChecked: boolean;
  onClick: () => void;
};

export type ContextualAction = "REFRESH" | "PULL" | "PUSH" | null;

export type LabelProps = { text: string };

export type TextInputProps = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
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
  isLoading?: boolean;
  loadingText?: string;
  text: string;
  onClick: () => Promise<void>;
};

export type ModalProps = {
  children: ReactNode;
  close: () => void;
  modalClassname?: string;
  title: string;
};

export type CurrentCommitProps = {
  commit?: Commit;
  close: () => Promise<void>;
};
