import { TabsTrigger } from "../ui/tabs";

interface Props {
  value: string;
  label: string;
  leadingIcon?: React.ReactElement;
}

export default function TabsTriggerButton({
  value,
  label,
  leadingIcon,
}: Props) {
  return (
    <TabsTrigger
      value={value}
      className="flex items-center gap-1 bg-transparent shadow-none! py-4 border-b-4 border-b-transparent! aria-selected:border-b-neutral-900! hover:border-b-neutral-900! rounded-none transition-all! duration-200 hover:cursor-pointer"
    >
      {leadingIcon}
      {label}
    </TabsTrigger>
  );
}
