"use client";

import BiKanbanFill from "~iconify/bi/kanban-fill";
import ButtonSideMenu from "./button-sidemenu";
import FaLegal from "~iconify/fa/legal";
import FluentEmojiHighContrastWood from "~iconify/fluent-emoji-high-contrast/wood";
import LogOut from "@/actions/logout";
import MaterialSymbolsDashboardRounded from "~iconify/material-symbols/dashboard-rounded";
import MaterialSymbolsRoomServiceRounded from "~iconify/material-symbols/room-service-rounded";
import MaterialSymbolsWebhook from "~iconify/material-symbols/webhook";
import MdiForm from "~iconify/mdi/form";
import PopoverButton from "../popover/popover";
import UserDropdownInfo from "./user-info-dropdown";
import { cn } from "@/lib/utils";
import MaterialSymbolsExpandAllRounded from "~iconify/material-symbols/expand-all-rounded";

export default function Sidemenu() {
  return (
    <aside className="flex flex-col items-center gap-8 py-6 transition-all duration-200">
      <PopoverButton
        disposeOnButtonClick={true}
        contents={
          <div className="flex flex-col">
            <UserDropdownInfo />
          </div>
        }
        renderClass="w-full"
        // TODO - Replace this icon for a self-made Logo
        render={
          <div className="mx-4 flex items-center justify-between rounded-2xl bg-white p-2 text-neutral-800">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-neutral-800 p-2 text-white">
                <FluentEmojiHighContrastWood width={32} height={32} />
              </div>
              <p className="flex h-full flex-col justify-between text-left">
                <span className="text-md font-bold">MyWorkshop</span>
                <span className="text-xs text-neutral-500">Workspace</span>
              </p>
            </div>
            <MaterialSymbolsExpandAllRounded width={16} height={16} />
          </div>
        }
        side="right"
      />
      <div className="flex h-full min-w-2xs flex-col justify-between">
        <div className="flex flex-col transition-all duration-200">
          <ButtonSideMenu
            href="/workshop"
            label="Overview"
            icon={<MaterialSymbolsDashboardRounded width={36} height={36} />}
          />
          <ButtonSideMenu
            href="/workshop/pipelines"
            label="Pipelines"
            icon={<BiKanbanFill width={36} height={36} />}
          />
          <ButtonSideMenu
            href="/workshop/services"
            label="Services"
            icon={<MaterialSymbolsRoomServiceRounded width={36} height={36} />}
          />
          <ButtonSideMenu
            href="/workshop/automation"
            label="Automation"
            icon={<MaterialSymbolsWebhook width={36} height={36} />}
          />
          <ButtonSideMenu
            href="/workshop/forms"
            label="Forms"
            icon={<MdiForm width={36} height={36} />}
          />
          <ButtonSideMenu
            href="/workshop/tos"
            label="Terms of Service"
            icon={<FaLegal width={36} height={36} />}
          />
        </div>
      </div>
    </aside>
  );
}
