import IxSuccess from "~iconify/ix/success";

interface Props {
  message?: string;
}

export default function FormSuccess({ message }: Props) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 bg-emerald-100 p-3 rounded-md w-full text-emerald-700">
      <IxSuccess width="24" height="24" />
      <p>{message}</p>
    </div>
  );
}
