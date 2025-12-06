import MaterialSymbolsWarningOutlineRounded from "~iconify/material-symbols/warning-outline-rounded";

interface Props {
  message?: string;
}

export default function FormError({ message }: Props) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 bg-pink-100 p-3 rounded-md w-full text-pink-700">
      <MaterialSymbolsWarningOutlineRounded width="24" height="24" />
      <p>{message}</p>
    </div>
  );
}
