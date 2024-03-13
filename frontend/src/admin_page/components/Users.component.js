import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#ffffff",
      main: "#ffffff",
      dark: "#ffffff",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ffffff",
      main: "#ffffff",
      dark: "#ffffff",
      contrastText: "#000",
    },
  },
});

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();

    setRows((oldRows) => [
      ...oldRows,
      { id, idUser: null, username: "", password: "", role: 1, isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "username" },
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add new user
        </Button>
      </GridToolbarContainer>
    </ThemeProvider>
  );
}

export function UsersComponent(props) {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  useEffect(() => {
    axios.get("http://localhost:3002/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      const rows = response.data.map((row) => ({
        id: randomId(),
        idUser: row.id,
        username: row.username,
        password: row.password,
        role: row.role,
      }));
      setRows(rows.filter((row) => row.idUser !== (+props.idUser)));
    });
  }, [props.idUser]);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    const idUser = rows.find((row) => row.id === id).idUser;

    await axios.delete(`http://localhost:3002/users/${idUser}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((error) => {
      alert(error.response.data.message || "Error!");
      return;
    });

    await axios.delete(`http://localhost:3001/users/${idUser}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((error) => {
      alert(error.response.data.message || "Error!");
      return;
    });


    alert("User deleted successfully!");
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    const rowToDB = {
      username: newRow.username || undefined,
      password: newRow.password || undefined,
      role: newRow.role || undefined,
    };

    if (newRow.isNew) {
      const response = await axios.post("http://localhost:3002/users", rowToDB, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).catch((error) => {
        alert(error.response.data.message || "Error!");
        return;
      });

      await axios.post("http://localhost:3001/users", {idUser: response.data.id}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).catch ((error) => {
        alert(error.response.data.message || "Error!");
        return;
      });

      const createdRow = { ...newRow, idUser: response.data.id, isNew: false };
      setRows((oldRows) => {
        const newRows = [...oldRows];
        const index = oldRows.findIndex((row) => row.id === newRow.id);
        newRows[index] = createdRow;
        return newRows;
      });
      return createdRow;
    }

    const updatedRow = { ...newRow, isNew: false };
    await axios
      .patch(`http://localhost:3002/users/${updatedRow.idUser}`, rowToDB, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then(() => {
        alert("User updated successfully!");
      })
      .catch((error) => {
        alert(error.response.data.message || "Error!");
        return;
      });

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "username",
      headerName: "Username",
      width: 250,
      editable: true,
    },
    {
      field: "password",
      headerName: "Password",
      width: 180,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "role",
      headerName: "Role",
      type: "singleSelect",
      width: 150,
      headerAlign: "left",
      align: "left",
      editable: true,
      valueOptions: [
        { value: 0, label: "Admin" },
        { value: 1, label: "User" },
      ],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        style={{ border: "none" }}
      />
    </Box>
  );
}
