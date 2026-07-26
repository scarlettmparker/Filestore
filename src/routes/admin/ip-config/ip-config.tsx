import { useState, useCallback, Suspense } from "react";
import { useOutlet, useNavigate } from "react-router-dom";
import AccessTabs from "~/components/admin/access-tabs";
import IpList from "~/components/admin/ip-list";
import IpDetailPlaceholder from "~/components/admin/ip-detail-placeholder";
import {
  IpDetailSkeleton,
  AdminPageSkeleton,
} from "~/components/admin/skeletons";
import AddIpDialog from "~/components/admin/add-ip-dialog";
import EditIpDialog from "~/components/admin/edit-ip-dialog";
import ConfirmDeleteIpDialog from "~/components/admin/confirm-delete-ip-dialog";
import { executeMutation } from "@sun/ssr";
import type { IpWhitelistEntry } from "~/generated/graphql";
import styles from "./ip-config.module.css";

/**
 * IP whitelist configuration page.
 */
const IpConfig = () => {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<IpWhitelistEntry | null>(
    null,
  );
  const [deletingEntry, setDeletingEntry] = useState<IpWhitelistEntry | null>(
    null,
  );

  const handleAdd = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);
  const handleAddSave = useCallback(
    async (
      pattern: string,
      description: string | null,
      immutable: boolean,
      enabled: boolean,
    ) => {
      await executeMutation("gaia/createIpWhitelistEntry", {
        pattern,
        description,
        immutable,
        enabled,
      });
    },
    [],
  );

  const handleEdit = useCallback((entry: IpWhitelistEntry) => {
    setEditingEntry(entry);
  }, []);
  const handleEditClose = useCallback(() => {
    setEditingEntry(null);
  }, []);

  const handleSave = useCallback(
    async (
      id: string,
      pattern: string,
      description: string | null,
      enabled: boolean,
    ) => {
      await executeMutation("gaia/updateIpWhitelistEntry", {
        id,
        pattern,
        description,
        enabled,
      });
      setEditingEntry(null);
    },
    [],
  );

  const handleDelete = useCallback((entry: IpWhitelistEntry) => {
    setDeletingEntry(entry);
  }, []);
  const handleDeleteClose = useCallback(() => {
    setDeletingEntry(null);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingEntry) return;
    await executeMutation("gaia/deleteIpWhitelistEntry", {
      id: deletingEntry.id,
    });
    setDeletingEntry(null);
    navigate("/admin/access/ip");
  }, [deletingEntry, navigate]);

  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <div className={styles.items_layout}>
        <div className={styles.items_list_panel}>
          <AccessTabs />
          <IpList
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <div className={styles.items_detail_panel}>
          <Suspense fallback={<IpDetailSkeleton />}>
            {outlet ?? <IpDetailPlaceholder />}
          </Suspense>
        </div>
      </div>
      <AddIpDialog
        open={addOpen}
        onClose={handleAddClose}
        onSave={handleAddSave}
      />
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
