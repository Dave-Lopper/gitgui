export type CheckboxProps = {
  className?: string;
  isChecked: boolean;
  onClick: () => void;
};

export type ContextualAction = "REFRESH" | "PULL" | "PUSH" | null;

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
