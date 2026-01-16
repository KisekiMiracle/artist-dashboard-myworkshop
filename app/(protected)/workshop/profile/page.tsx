import Breadcrumbs from "@/components/ui/breadcrubs";

export default function Page() {
  return (
    <div className="flex h-full gap-8">
      <div className="flex w-full flex-col gap-4 overflow-x-hidden py-8">
        <div className="px-8">
          <Breadcrumbs />
          <hr />
        </div>
      </div>
    </div>
  );
}
