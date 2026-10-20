"use client";

import useDrive from "./components/useDrive";
import Toolbar from "./components//Toolbar";
import FileList from "./components/FileList";
import StatusBar from "./components/StatusBar";
import ContextMenu from "./components/ContextMenu";
import DeleteDialog from "./components/DeleteDialog";
import StorageDiagram from "./components/StorageDiagram";

export default function DrivePage() {
  const d = useDrive();

  return (
    <div className="h-[calc(100dvh-3.5rem)] lg:h-dvh">
      <div
        ref={d.rootRef}
        tabIndex={0}
        onKeyDown={d.onKeyDown}
        className="relative flex h-full flex-col overflow-hidden bg-[#14110a]/60 outline-none"
      >
        <Toolbar d={d} />

        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-64 shrink-0 border-r border-[#FFD21F]/15 bg-[#14110a]/40 md:block">
            <StorageDiagram
              driveBytes={d.used}
              driveFiles={d.fileCount}
              usage={d.usage}
              usageError={d.usageErr}
              onRefresh={d.refresh}
            />
          </aside>
          <FileList d={d} />
        </div>

        <StatusBar d={d} />

        <input
          ref={d.fileRef}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            d.uploadFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </div>

      <ContextMenu d={d} />
      <DeleteDialog d={d} />
    </div>
  );
}