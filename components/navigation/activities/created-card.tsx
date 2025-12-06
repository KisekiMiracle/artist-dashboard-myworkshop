import ActivityCard from "./card";
import { NewCardIcon } from "./icons";
import { auth } from "@/auth";

export default async function ActivityCardCreation() {
  const session = await auth();
  const user = session?.user;

  return (
    <ActivityCard
      leadingIcon={<NewCardIcon />}
      render={
        <div className="flex flex-col gap-1">
          <p className="flex items-center gap-1">
            <span className="font-semibold">{user?.name}</span> created a new
            card.
          </p>
          <time className="text-neutral-500 text-xs">
            {new Date().toLocaleString()}
          </time>
        </div>
      }
    />
  );
}
