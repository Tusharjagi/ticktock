export interface MenuItem {
  label: string;
  onSelect: () => void;
  danger?: boolean;
}
