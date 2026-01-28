"use client";

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Chip, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IUser } from "@/lib/types";
import { useState } from "react";
import LabelChip from "./LabelChip";

interface Props {
  rows: IUser[];
  loading: boolean;
  onChangeRole: (user: IUser) => void;
  onChangeStatus: (user: IUser) => void;
}

function UserActionsMenu({
  user,
  onChangeRole,
  onChangeStatus,
}: {
  user: IUser;
  onChangeRole: (user: IUser) => void;
  onChangeStatus: (user: IUser) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onChangeRole(user);
          }}
        >
          Change Role
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onChangeStatus(user);
          }}
        >
          Change Status
        </MenuItem>
      </Menu>
    </>
  );
}

export default function AdminUserTable({
  rows,
  loading,
  onChangeRole,
  onChangeStatus,
}: Props) {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 3,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 3,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 2,
      renderCell: (params: GridRenderCellParams) => (
        <LabelChip type="role" value={params.row.role} />
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? "Active" : "Disabled"}
          size="small"
          color={params.value ? "info" : "default"}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <UserActionsMenu
          user={params.row}
          onChangeRole={onChangeRole}
          onChangeStatus={onChangeStatus}
        />
      ),
    },
  ];

  return (
    <div style={{ height: 520, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          "& .MuiDataGrid-cell": {
            paddingLeft: 3,
            paddingRight: 3,
          },
          "& .MuiDataGrid-columnHeader": {
            paddingLeft: 3,
            paddingRight: 3,
          },
        }}
      />
    </div>
  );
}
