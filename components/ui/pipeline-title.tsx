"use client";

import { QueryUserPipelines } from "@/actions/tasks/query-user-pipelines";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PipelineTitle() {
  const [title, setTitle] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const session = await QueryUserPipelines();
      const pipelineID = pathname.split("/")[3];
      const pipeline = session.find((pipeline) => pipeline.id === pipelineID);

      setTitle(pipeline.title);
    })();
  }, []);
  return <h1 className="text-3xl font-bold">{title}</h1>;
}
