export type CheckboxProps = {
  className?: string;
  isChecked: boolean;
  onClick: () => void;
};

export type SubmitButtonProps = {
  disabled: boolean;
  text: string;
  onClick: () => Promise<void>;
};
