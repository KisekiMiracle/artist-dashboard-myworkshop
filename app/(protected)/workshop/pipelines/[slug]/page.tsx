import {
  CalendarIcon,
  KanbanIcon,
  ListIcon,
  TableIcon,
} from "@/components/view/view-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Breadcrumbs from "@/components/ui/breadcrubs";
import FilterTasksButton from "@/components/view/filter-button";
import { KanbanViewBoard } from "@/components/kanban/kanban";
import ListView from "@/components/list/listView";
import { Metadata } from "next";
import TabsTriggerButton from "@/components/view/tabs-trigger";
import ViewNewTaskButton from "@/components/view/new-task-button";
import PipelineSettingsButton from "@/components/view/pipeline-settings-button";
import NewCategoryButton from "@/components/view/new-category-button";
import PipelineTitle from "@/components/ui/pipeline-title";
import Link from "next/link";
import IcRoundArrowBack from "~iconify/ic/round-arrow-back";
import BackLink from "@/components/ui/back-link";
import { TagManagerButton } from "@/components/view/tags-manager";
import QueryPipelineName from "@/actions/tasks/query-pipeline-name";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { title } = await QueryPipelineName(slug);

  console.log(slug, title);
  return {
    title: `${title} | MyWorkshop`,
    description: "The contents of this Pipeline.",
  };
}

export default async function WorkshopPage() {
  return (
    <div className="flex h-full gap-8">
      <div className="flex w-full flex-col overflow-x-hidden px-8 py-8">
        <div>
          <Breadcrumbs />
          <hr />
        </div>
        <div className="mt-8 flex items-center gap-2">
          <BackLink href="/workshop/pipelines" />
          <PipelineTitle />
        </div>
        <div className="flex w-full gap-8 overflow-auto">
          <Tabs defaultValue="kanban" className="w-full">
            <div className="sticky top-0 flex w-full items-end justify-between border-b border-b-neutral-200 bg-white">
              <TabsList className="rounded-none bg-transparent p-0">
                <TabsTriggerButton
                  label="Kanban"
                  value="kanban"
                  leadingIcon={<KanbanIcon />}
                />
                <TabsTriggerButton
                  label="List"
                  value="list"
                  leadingIcon={<ListIcon />}
                />
              </TabsList>
              <div className="flex items-center gap-2 pb-4">
                <PipelineSettingsButton />
                <FilterTasksButton />
                <ViewNewTaskButton />
                <NewCategoryButton />
                <TagManagerButton />
              </div>
            </div>
            <div className="mt-4">
              <TabsContent value="kanban">
                <KanbanViewBoard />
              </TabsContent>
              <TabsContent value="list">
                <ListView />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      {/* <PipelineSidemenu /> */}
    </div>
  );
}
