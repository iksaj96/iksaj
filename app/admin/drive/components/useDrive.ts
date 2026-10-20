"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent as RKeyboardEvent,
  type MouseEvent as RMouseEvent,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { DRIVE_QUOTA, type BucketUsage } from "./StorageDiagram";
import type { DropHandlers, Item, SortKey, ViewMode } from "./types";
import {
  BUCKET,
  COLS,
  DRAG_MIME,
  MAX_SIZE,
  PAGE,
  ROOT_NAME,
  canPreview,
  errMsg,
  formatSize,
  nameCmp,
  sleep,
  typeLabel,
  uniqueName,
} from "./utils";

export default function useDrive() {
  const supabase = useMemo(() => createClient(), []);

  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  // pemakaian penyimpanan per bucket (untuk diagram)
  const [usage, setUsage] = useState<BucketUsage>({});
  const [usageErr, setUsageErr] = useState(false);

  // riwayat navigasi (maju / mundur)
  const [hist, setHist] = useState<(string | null)[]>([null]);
  const [hi, setHi] = useState(0);
  const currentId = hist[hi];

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const anchorRef = useRef<string | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("icons");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Item[] | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    onItem: boolean;
  } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dropHover, setDropHover] = useState<string | null>(null);
  const [coarse, setCoarse] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* ----- data ----- */

  const load = useCallback(async () => {
    const all: Item[] = [];
    let failed = false;
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase
        .from("drive_items")
        .select(COLS)
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
        .range(from, from + PAGE - 1);
      if (error) {
        setError(errMsg(error));
        failed = true;
        break;
      }
      all.push(...((data ?? []) as Item[]));
      if (!data || data.length < PAGE) break;
    }
    if (!failed) setItems(all);
    setLoaded(true);
  }, [supabase]);

  const loadUsage = useCallback(async () => {
    const { data, error } = await supabase.rpc("storage_usage");
    if (error) {
      setUsageErr(true);
      return;
    }
    const m: BucketUsage = {};
    for (const r of (data ?? []) as {
      bucket_id: string;
      files: number | string;
      bytes: number | string;
    }[]) {
      m[r.bucket_id] = { files: Number(r.files), bytes: Number(r.bytes) };
    }
    setUsage(m);
    setUsageErr(false);
  }, [supabase]);

  const refresh = useCallback(() => {
    load();
    loadUsage();
  }, [load, loadUsage]);

  useEffect(() => {
    load();
    loadUsage();
  }, [load, loadUsage]);

  const { byId, kids } = useMemo(() => {
    const byId = new Map<string, Item>();
    const kids = new Map<string | null, Item[]>();
    for (const it of items) {
      byId.set(it.id, it);
      const arr = kids.get(it.parent_id) ?? [];
      arr.push(it);
      kids.set(it.parent_id, arr);
    }
    return { byId, kids };
  }, [items]);

  const collectDesc = useCallback(
    (id: string) => {
      const out: Item[] = [];
      const st = [...(kids.get(id) ?? [])];
      while (st.length) {
        const it = st.pop()!;
        out.push(it);
        if (it.is_folder) st.push(...(kids.get(it.id) ?? []));
      }
      return out;
    },
    [kids]
  );

  const crumbs = useMemo(() => {
    const chain: { id: string | null; name: string }[] = [];
    let p: string | null = currentId;
    let guard = 0;
    while (p && guard++ < 100) {
      const it = byId.get(p);
      if (!it) break;
      chain.unshift({ id: it.id, name: it.name });
      p = it.parent_id;
    }
    return [{ id: null as string | null, name: ROOT_NAME }, ...chain];
  }, [currentId, byId]);

  const currentName = crumbs[crumbs.length - 1].name;

  // folder aktif terhapus → kembali ke akar
  useEffect(() => {
    if (loaded && currentId && !byId.has(currentId)) {
      setHist([null]);
      setHi(0);
    }
  }, [loaded, currentId, byId]);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const set = () => setCoarse(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  /* ----- daftar yang tampil ----- */

  const listed = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list: Item[];
    if (q) {
      list = [];
      const st = [...(kids.get(currentId) ?? [])];
      while (st.length) {
        const it = st.pop()!;
        if (it.name.toLowerCase().includes(q)) list.push(it);
        if (it.is_folder) st.push(...(kids.get(it.id) ?? []));
      }
    } else {
      list = [...(kids.get(currentId) ?? [])];
    }
    const dir = sortAsc ? 1 : -1;
    list.sort((a, b) => {
      if (a.is_folder !== b.is_folder) return a.is_folder ? -1 : 1;
      let r = 0;
      if (sortKey === "name") r = nameCmp(a, b);
      else if (sortKey === "updated_at")
        r = Date.parse(a.updated_at) - Date.parse(b.updated_at);
      else if (sortKey === "type")
        r = typeLabel(a).localeCompare(typeLabel(b)) || nameCmp(a, b);
      else r = (a.size ?? 0) - (b.size ?? 0);
      return r * dir || nameCmp(a, b);
    });
    return list;
  }, [kids, currentId, query, sortKey, sortAsc]);

  const selectedItems = useMemo(
    () =>
      Array.from(selected)
        .map((id) => byId.get(id))
        .filter((x): x is Item => !!x),
    [selected, byId]
  );
  const single = selectedItems.length === 1 ? selectedItems[0] : null;
  const selFiles = selectedItems.filter((i) => !i.is_folder);
  const selSize = selFiles.reduce((s, i) => s + (i.size ?? 0), 0);

  const used = useMemo(
    () => items.reduce((s, i) => s + (i.is_folder ? 0 : Number(i.size) || 0), 0),
    [items]
  );
  const fileCount = useMemo(
    () => items.filter((i) => !i.is_folder).length,
    [items]
  );

  function pathOf(it: Item) {
    const names: string[] = [];
    let p = it.parent_id;
    let n = 0;
    while (p && n++ < 50) {
      const x = byId.get(p);
      if (!x) break;
      names.unshift(x.name);
      p = x.parent_id;
    }
    return [ROOT_NAME, ...names].join(" › ");
  }

  /* ----- navigasi ----- */

  function resetView() {
    setSelected(new Set());
    setQuery("");
    setRenamingId(null);
    anchorRef.current = null;
  }

  function navigate(id: string | null) {
    if (id === currentId) return;
    setHist((h) => [...h.slice(0, hi + 1), id]);
    setHi((i) => i + 1);
    resetView();
  }

  function goBack() {
    if (hi <= 0) return;
    setHi(hi - 1);
    resetView();
  }

  function goForward() {
    if (hi >= hist.length - 1) return;
    setHi(hi + 1);
    resetView();
  }

  function goUp() {
    if (currentId === null) return;
    navigate(byId.get(currentId)?.parent_id ?? null);
  }

  /* ----- pilihan & menu ----- */

  function selectOnly(id: string) {
    setSelected(new Set([id]));
    anchorRef.current = id;
  }

  function clearSelection() {
    setSelected(new Set());
    setMenu(null);
  }

  function handleItemClick(e: RMouseEvent, it: Item) {
    e.stopPropagation();
    setMenu(null);
    if (e.ctrlKey || e.metaKey) {
      setSelected((prev) => {
        const n = new Set(prev);
        if (n.has(it.id)) n.delete(it.id);
        else n.add(it.id);
        return n;
      });
      anchorRef.current = it.id;
      return;
    }
    if (e.shiftKey && anchorRef.current) {
      const ids = listed.map((i) => i.id);
      const a = ids.indexOf(anchorRef.current);
      const b = ids.indexOf(it.id);
      if (a >= 0 && b >= 0) {
        const [s, t] = a < b ? [a, b] : [b, a];
        setSelected(new Set(ids.slice(s, t + 1)));
        return;
      }
    }
    // layar sentuh: ketuk folder langsung membuka
    if (coarse && it.is_folder) {
      openItem(it);
      return;
    }
    selectOnly(it.id);
  }

  function openMenu(x: number, y: number, onItem: boolean) {
    setMenu({
      x: Math.max(8, Math.min(x, window.innerWidth - 224)),
      y: Math.max(8, Math.min(y, window.innerHeight - 250)),
      onItem,
    });
  }

  function handleItemContext(e: RMouseEvent, it: Item) {
    e.preventDefault();
    e.stopPropagation();
    if (!selected.has(it.id)) selectOnly(it.id);
    openMenu(e.clientX, e.clientY, true);
  }

  function handleBlankContext(e: RMouseEvent) {
    e.preventDefault();
    setSelected(new Set());
    openMenu(e.clientX, e.clientY, false);
  }

  /* ----- berkas: buka / unduh ----- */

  async function fetchUrl(item: Item, download: boolean) {
    if (!item.storage_path) return null;
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(
        item.storage_path,
        120,
        download ? { download: item.name } : undefined
      );
    if (error || !data) {
      setError(errMsg(error));
      return null;
    }
    return data.signedUrl;
  }

  async function downloadFile(item: Item) {
    const url = await fetchUrl(item, true);
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function openItem(it: Item) {
    if (it.is_folder) {
      navigate(it.id);
      return;
    }
    if (canPreview(it.mime_type)) {
      // buka tab dulu agar tidak diblokir popup blocker
      const w = window.open("", "_blank");
      const url = await fetchUrl(it, false);
      if (url && w) w.location.href = url;
      else w?.close();
    } else {
      await downloadFile(it);
    }
  }

  async function downloadSelected() {
    for (const f of selFiles) {
      await downloadFile(f);
      await sleep(300);
    }
  }

  /* ----- folder baru, ubah nama, hapus, pindah ----- */

  async function newFolder() {
    const name = uniqueName("Folder baru", kids.get(currentId) ?? []);
    const { data, error } = await supabase
      .from("drive_items")
      .insert({ parent_id: currentId, name, is_folder: true })
      .select(COLS)
      .single();
    if (error) {
      setError(errMsg(error));
      return;
    }
    const row = data as Item;
    setItems((p) => [...p, row]);
    setQuery("");
    selectOnly(row.id);
    setRenamingId(row.id);
  }

  function startRename() {
    if (single) setRenamingId(single.id);
  }

  function cancelRename() {
    setRenamingId(null);
    rootRef.current?.focus();
  }

  async function commitRename(it: Item, raw: string) {
    setRenamingId(null);
    rootRef.current?.focus();
    const name = raw.trim().slice(0, 200);
    if (!name || name === it.name) return;
    const { error } = await supabase
      .from("drive_items")
      .update({ name })
      .eq("id", it.id);
    if (error) {
      setError(errMsg(error));
      return;
    }
    setItems((p) =>
      p.map((x) =>
        x.id === it.id
          ? { ...x, name, updated_at: new Date().toISOString() }
          : x
      )
    );
  }

  function askDelete(list: Item[]) {
    if (list.length) setToDelete(list);
  }

  function cancelDelete() {
    setToDelete(null);
    rootRef.current?.focus();
  }

  async function doDelete(e: FormEvent) {
    e.preventDefault();
    if (!toDelete || deleting) return;
    setDeleting(true);
    setError(null);
    try {
      const list = toDelete;
      const gone = new Set<string>();
      const paths = new Set<string>();
      for (const it of list) {
        gone.add(it.id);
        if (it.is_folder) {
          for (const d of collectDesc(it.id)) {
            gone.add(d.id);
            if (!d.is_folder && d.storage_path) paths.add(d.storage_path);
          }
        } else if (it.storage_path) {
          paths.add(it.storage_path);
        }
      }
      const arr = [...paths];
      for (let i = 0; i < arr.length; i += 100) {
        const { error } = await supabase.storage
          .from(BUCKET)
          .remove(arr.slice(i, i + 100));
        if (error) throw error;
      }
      // isi folder ikut terhapus lewat ON DELETE CASCADE
      const { error } = await supabase
        .from("drive_items")
        .delete()
        .in(
          "id",
          list.map((i) => i.id)
        );
      if (error) throw error;
      setItems((p) => p.filter((x) => !gone.has(x.id)));
      setSelected(new Set());
      loadUsage();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setDeleting(false);
      setToDelete(null);
      rootRef.current?.focus();
    }
  }

  async function moveItems(ids: string[], targetId: string | null) {
    const valid = ids.filter((id) => {
      const it = byId.get(id);
      if (!it || it.parent_id === targetId || id === targetId) return false;
      let p: string | null = targetId;
      let guard = 0;
      while (p && guard++ < 100) {
        if (p === id) return false; // tidak boleh masuk ke dalam dirinya sendiri
        p = byId.get(p)?.parent_id ?? null;
      }
      return true;
    });
    if (!valid.length) return;
    const { error } = await supabase
      .from("drive_items")
      .update({ parent_id: targetId })
      .in("id", valid);
    if (error) {
      setError(errMsg(error));
      return;
    }
    const now = new Date().toISOString();
    const set = new Set(valid);
    setItems((p) =>
      p.map((x) =>
        set.has(x.id) ? { ...x, parent_id: targetId, updated_at: now } : x
      )
    );
    setSelected(new Set());
  }

  /* ----- seret & lepas (pindah item) ----- */

  function dropProps(id: string | null): DropHandlers {
    const key = id ?? "root";
    return {
      onDragOver: (e) => {
        if (!e.dataTransfer.types.includes(DRAG_MIME)) return;
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "move";
        setDropHover(key);
      },
      onDragLeave: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setDropHover((h) => (h === key ? null : h));
        }
      },
      onDrop: (e) => {
        if (!e.dataTransfer.types.includes(DRAG_MIME)) return;
        e.preventDefault();
        e.stopPropagation();
        setDropHover(null);
        try {
          const ids = JSON.parse(e.dataTransfer.getData(DRAG_MIME)) as string[];
          moveItems(ids, id);
        } catch {}
      },
    };
  }

  function onItemDragStart(e: DragEvent<HTMLElement>, it: Item) {
    let ids: string[];
    if (selected.has(it.id)) ids = [...selected];
    else {
      selectOnly(it.id);
      ids = [it.id];
    }
    e.dataTransfer.setData(DRAG_MIME, JSON.stringify(ids));
    e.dataTransfer.effectAllowed = "move";
  }

  /* ----- unggah ----- */

  async function uploadFiles(files: File[]) {
    if (!files.length || busy) return;
    const parent = currentId;
    setError(null);
    const failed: string[] = [];
    let running = used;

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      setBusy(`Mengunggah ${i + 1}/${files.length}: ${f.name}`);

      if (f.size > MAX_SIZE) {
        failed.push(`${f.name} (lebih dari 50 MB)`);
        continue;
      }
      if (running + f.size > DRIVE_QUOTA) {
        failed.push(
          `${f.name} (melebihi jatah Drive ${formatSize(DRIVE_QUOTA)})`
        );
        continue;
      }

      const id = crypto.randomUUID();
      const storagePath = `files/${id}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, f, {
          contentType: f.type || "application/octet-stream",
        });
      if (upErr) {
        failed.push(`${f.name} (${upErr.message})`);
        continue;
      }

      const { data, error: dbErr } = await supabase
        .from("drive_items")
        .insert({
          id,
          parent_id: parent,
          name: f.name,
          is_folder: false,
          storage_path: storagePath,
          mime_type: f.type || null,
          size: f.size,
        })
        .select(COLS)
        .single();
      if (dbErr) {
        await supabase.storage.from(BUCKET).remove([storagePath]);
        failed.push(`${f.name} (${dbErr.message})`);
      } else {
        running += f.size;
        setItems((p) => [...p, data as Item]);
      }
    }

    setBusy(null);
    if (failed.length) setError("Gagal mengunggah: " + failed.join("; "));
    loadUsage();
  }

  function openUploadDialog() {
    fileRef.current?.click();
  }

  /* ----- papan ketik ----- */

  function onKeyDown(e: RKeyboardEvent<HTMLDivElement>) {
    const t = e.target as HTMLElement;
    if (["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName)) return;
    if (toDelete) return;
    const mod = e.ctrlKey || e.metaKey;

    if (e.key === "Delete" && selectedItems.length) {
      e.preventDefault();
      askDelete(selectedItems);
    } else if (e.key === "F2") {
      e.preventDefault();
      startRename();
    } else if (e.key === "Enter" && single && t.tagName !== "BUTTON") {
      e.preventDefault();
      openItem(single);
    } else if (mod && e.key.toLowerCase() === "a") {
      e.preventDefault();
      setSelected(new Set(listed.map((i) => i.id)));
    } else if (e.key === "Escape") {
      clearSelection();
    } else if (e.altKey && e.key === "ArrowUp") {
      e.preventDefault();
      goUp();
    } else if ((e.altKey && e.key === "ArrowLeft") || e.key === "Backspace") {
      e.preventDefault();
      goBack();
    } else if (e.altKey && e.key === "ArrowRight") {
      e.preventDefault();
      goForward();
    } else if (
      ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key) &&
      listed.length
    ) {
      e.preventDefault();
      const ids = listed.map((i) => i.id);
      const cur = anchorRef.current ? ids.indexOf(anchorRef.current) : -1;
      const fwd = e.key === "ArrowDown" || e.key === "ArrowRight";
      let next = cur < 0 ? (fwd ? 0 : ids.length - 1) : cur + (fwd ? 1 : -1);
      next = Math.max(0, Math.min(ids.length - 1, next));
      selectOnly(ids[next]);
      requestAnimationFrame(() => {
        rootRef.current
          ?.querySelector(`[data-id="${ids[next]}"]`)
          ?.scrollIntoView({ block: "nearest" });
      });
    }
  }

  /* ----- props baris / ubin ----- */

  const rowProps = (it: Item) => ({
    "data-id": it.id,
    role: "option" as const,
    "aria-selected": selected.has(it.id),
    draggable: renamingId !== it.id,
    onClick: (e: RMouseEvent) => handleItemClick(e, it),
    onDoubleClick: (e: RMouseEvent) => {
      e.stopPropagation();
      openItem(it);
    },
    onContextMenu: (e: RMouseEvent) => handleItemContext(e, it),
    onDragStart: (e: DragEvent<HTMLElement>) => onItemDragStart(e, it),
    ...(it.is_folder ? dropProps(it.id) : {}),
  });

  return {
    // ref
    rootRef,
    fileRef,
    // state
    loaded,
    error,
    setError,
    busy,
    usage,
    usageErr,
    hi,
    histLen: hist.length,
    currentId,
    selected,
    query,
    setQuery,
    view,
    setView,
    sortKey,
    setSortKey,
    sortAsc,
    setSortAsc,
    renamingId,
    toDelete,
    deleting,
    menu,
    setMenu,
    dragging,
    setDragging,
    dropHover,
    // turunan
    crumbs,
    currentName,
    listed,
    selectedItems,
    single,
    selFiles,
    selSize,
    used,
    fileCount,
    pathOf,
    // aksi
    refresh,
    navigate,
    goBack,
    goForward,
    goUp,
    openItem,
    downloadSelected,
    newFolder,
    startRename,
    cancelRename,
    commitRename,
    askDelete,
    cancelDelete,
    doDelete,
    dropProps,
    uploadFiles,
    openUploadDialog,
    onKeyDown,
    rowProps,
    clearSelection,
    handleBlankContext,
  };
}

export type Drive = ReturnType<typeof useDrive>;