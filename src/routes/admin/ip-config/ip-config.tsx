import { useState, useCallback, Suspense } from "react";
import { useOutlet, useNavigate } from "react-router-dom";
import AccessTabs from "~/components/admin/access-tabs";
import IpList from "~/components/admin/ip-list";
import IpDetailPlaceholder from "~/components/admin/ip-detail-placeholder";
import { IpDetailSkeleton, AdminPageSkeleton } from "~/components/admin/skeletons";
import AddIpDialog from "~/components/admin/add-ip-dialog";
import EditIpDialog from "~/components/admin/edit-ip-dialog";
import ConfirmDeleteIpDialog from "~/components/admin/confirm-delete-ip-dialog";
import { executeMutation, patchPageData } from "@sun/ssr";
import { useMutation, usePageData } from "@sun/ssr/react";
import type {
  CreateIpWhitelistEntryResponse,
  DeleteIpWhitelistEntryResponse,
  IpWhitelistEntry,
  UpdateIpWhitelistEntryResponse,
} from "~/generated/graphql";
import styles from "./ip-config.module.css";

/**
 * Mutation payload for creating, updating, or deleting an IP whitelist entry.
 */
type IpEntryPayload =
  | {
      action: "create";
      tempId: string;
      pattern: string;
      description: string | null;
      immutable: boolean;
      enabled: boolean;
    }
  | {
      action: "update";
      id: string;
      pattern: string;
      description: string | null;
      enabled: boolean;
    }
  | {
      action: "delete";
      id: string;
    };

/**
 * IP whitelist configuration page.
 */
const IpConfig = () => {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<IpWhitelistEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<IpWhitelistEntry | null>(null);

  const { data: entriesData } = usePageData<IpWhitelistEntry[]>("ipEntries", "ipEntries");

  const [entries, runEntry] = useMutation<
    IpEntryPayload,
    | CreateIpWhitelistEntryResponse
    | UpdateIpWhitelistEntryResponse
    | DeleteIpWhitelistEntryResponse,
    IpWhitelistEntry[]
  >({
    base: entriesData,
    reducer: (current, payload) => {
      if (payload.action === "create") {
        return [
          ...current,
          {
            id: payload.tempId,
            pattern: payload.pattern,
            description: payload.description,
            enabled: payload.enabled,
            immutable: payload.immutable,
            createdAt: null,
            updatedAt: null,
          },
        ];
      }
      if (payload.action === "update") {
        return current.map((entry) =>
          entry.id === payload.id
            ? {
                ...entry,
                pattern: payload.pattern,
                description: payload.description,
                enabled: payload.enabled,
              }
            : entry,
        );
      }
      return current.filter((entry) => entry.id !== payload.id);
    },
    action: (payload) => {
      if (payload.action === "create") {
        return executeMutation<CreateIpWhitelistEntryResponse>("gaia/createIpWhitelistEntry", {
          pattern: payload.pattern,
          description: payload.description,
          immutable: payload.immutable,
          enabled: payload.enabled,
        });
      }
      if (payload.action === "update") {
        return executeMutation<UpdateIpWhitelistEntryResponse>("gaia/updateIpWhitelistEntry", {
          id: payload.id,
          pattern: payload.pattern,
          description: payload.description,
          enabled: payload.enabled,
        });
      }
      return executeMutation<DeleteIpWhitelistEntryResponse>("gaia/deleteIpWhitelistEntry", {
        id: payload.id,
      });
    },
    onSuccess: (response, payload) => {
      patchPageData<IpWhitelistEntry[]>("ipEntries", "ipEntries", undefined, (current) => {
        const list = current ?? entriesData;
        if ("entry" in response) {
          const tempId = payload.action === "create" ? payload.tempId : null;
          const withoutTemp = tempId ? list.filter((entry) => entry.id !== tempId) : list;
          const exists = withoutTemp.some((entry) => entry.id === response.entry.id);
          return exists
            ? withoutTemp.map((entry) => (entry.id === response.entry.id ? response.entry : entry))
            : [...withoutTemp, response.entry];
        }
        return list.filter((entry) => entry.id !== response.id);
      });
    },
    onError: (error) => console.error(error.message),
  });

  const handleAdd = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);
  const handleAddSave = useCallback(
    (pattern: string, description: string | null, immutable: boolean, enabled: boolean) => {
      runEntry({
        action: "create",
        tempId: crypto.randomUUID(),
        pattern,
        description,
        immutable,
        enabled,
      });
    },
    [runEntry],
  );

  const handleEdit = useCallback((entry: IpWhitelistEntry) => {
    setEditingEntry(entry);
  }, []);
  const handleEditClose = useCallback(() => {
    setEditingEntry(null);
  }, []);

  const handleSave = useCallback(
    (id: string, pattern: string, description: string | null, enabled: boolean) => {
      runEntry({ action: "update", id, pattern, description, enabled });
      setEditingEntry(null);
    },
    [runEntry],
  );

  const handleDelete = useCallback((entry: IpWhitelistEntry) => {
    setDeletingEntry(entry);
  }, []);
  const handleDeleteClose = useCallback(() => {
    setDeletingEntry(null);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deletingEntry) return;
    runEntry({ action: "delete", id: deletingEntry.id });
    setDeletingEntry(null);
    navigate("/admin/access/ip");
  }, [deletingEntry, runEntry, navigate]);

  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <div className={styles.items_layout}>
        <div className={styles.items_list_panel}>
          <AccessTabs />
          <IpList entries={entries} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
        <div className={styles.items_detail_panel}>
          <Suspense fallback={<IpDetailSkeleton />}>{outlet ?? <IpDetailPlaceholder />}</Suspense>
        </div>
      </div>
      <AddIpDialog open={addOpen} onClose={handleAddClose} onSave={handleAddSave} />
      <EditIpDialog
        entry={editingEntry}
        open={!!editingEntry}
        onClose={handleEditClose}
        onSave={handleSave}
      />
      <ConfirmDeleteIpDialog
        open={!!deletingEntry}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        pattern={deletingEntry?.pattern ?? ""}
      />
    </Suspense>
  );
};

export default IpConfig;
