interface Props {
  leadingIcon?: React.ReactNode;
  render?: React.ReactNode;
}

export default function ActivityCard({ leadingIcon, render }: Props) {
  return (
    <div
      className="justify-start gap-2 grid bg-white shadow-sm p-4 rounded-md"
      style={{ gridTemplateColumns: "auto 1fr" }}
    >
      {leadingIcon}
      {render}
    </div>
  );
}
