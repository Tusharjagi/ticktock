export interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  info?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}
