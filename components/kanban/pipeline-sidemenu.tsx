import ActivityCardCreation from "../navigation/activities/created-card";

export default function PipelineSidemenu() {
  // TODO - Add Max. Limit to activity card count from the backend.
  return (
    <div className="bg-neutral-100 p-8 rounded-r-4xl w-full max-w-xl h-full overflow-y-hidden">
      <aside className="flex flex-col gap-4 w-full max-h-full overflow-y-hidden">
        <h1 className="font-bold text-2xl whitespace-nowrap">
          Recent Activity
        </h1>
        <div className="flex flex-col gap-4 py-4 overflow-y-scroll">
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
          <ActivityCardCreation />
        </div>
      </aside>
    </div>
  );
}
