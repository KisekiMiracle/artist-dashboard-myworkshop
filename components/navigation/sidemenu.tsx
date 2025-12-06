"use client";

import BiKanbanFill from "~iconify/bi/kanban-fill";
import ButtonSideMenu from "./button-sidemenu";
import FaLegal from "~iconify/fa/legal";
import FluentEmojiHighContrastWood from "~iconify/fluent-emoji-high-contrast/wood";
import LogOut from "@/actions/logout";
import MaterialSymbolsDashboardRounded from "~iconify/material-symbols/dashboard-rounded";
import MaterialSymbolsLogoutRounded from "~iconify/material-symbols/logout-rounded";
import MaterialSymbolsRoomServiceRounded from "~iconify/material-symbols/room-service-rounded";
import MaterialSymbolsWebhook from "~iconify/material-symbols/webhook";
import MdiForm from "~iconify/mdi/form";
import PopoverButton from "../popover/popover";
import UserDropdownInfo from "./user-info-dropdown";
import { cn } from "@/lib/utils";

export default function Sidemenu() {
  return (
    <aside className="flex flex-col items-center gap-8 py-6 transition-all duration-200">
      <PopoverButton
        contents={
          <div className="flex flex-col">
            <UserDropdownInfo />
          </div>
        }
        renderClass="bg-white p-4 rounded-2xl text-neutral-800"
        // TODO - Replace this icon for a self-made Logo
        render={<FluentEmojiHighContrastWood width={36} height={36} />}
        side="right"
      />
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col transition-all duration-200">
          <ButtonSideMenu
            href="/workshop"
            label="MyWorkshop"
            icon={<MaterialSymbolsDashboardRounded width={36} height={36} />}
          />
          <ButtonSideMenu
            href="/workshop/pipelines"
            label="Pipelines"
            icon={<BiKanbanFill width={36} height={36} />}
          />
          <ButtonSideMenu
            href="/services"
            label="Services"
            icon={<MaterialSymbolsRoomServiceRounded width={36} height={36} />}
          />
          <ButtonSideMenu
            href="/automation"
            label="Automation"
            icon={<MaterialSymbolsWebhook width={36} height={36} />}
          />
          <ButtonSideMenu
            href="/forms"
            label="Forms"
            icon={<MdiForm width={36} height={36} />}
          />
          <ButtonSideMenu
            href="/tos"
            label="Terms of Service"
            icon={<FaLegal width={36} height={36} />}
          />
        </div>
        <form
          action={() => {
            LogOut();
          }}
        >
          <button
            type="submit"
            className={cn(
              "relative flex items-center gap-2 px-6 hover:px-8 py-4 border-l-4 border-l-transparent hover:border-l-amber-300 hover:[&>span]:w-full text-white hover:text-amber-300 transition-all duration-200 hover:cursor-pointer"
            )}
          >
            <MaterialSymbolsLogoutRounded width={36} height={36} />
            <span className="w-0 overflow-x-hidden text-ellipsis whitespace-nowrap transition-all duration-200">
              Log Out
            </span>
          </button>
        </form>
      </div>
    </aside>
  );
}
