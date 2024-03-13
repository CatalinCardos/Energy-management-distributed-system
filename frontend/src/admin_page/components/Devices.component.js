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
      {
        id,
        idDevice: null,
        description: "",
        address: "",
        energyConsumption: 1,
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "description" },
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add new device
        </Button>
      </GridToolbarContainer>
    </ThemeProvider>
  );
}

export function DevicesComponent() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [usersOptions, setUsersOptions] = useState([]);
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  useEffect(() => {
    axios.get("http://localhost:3001/devices", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      const devices = response.data.map((device) => ({
        id: randomId(),
        idDevice: device.id,
        description: device.description,
        address: device.address,
        energyConsumption: device.energyConsumption,
        userId: device.userId,
      }));
      setRows(devices);
    });

    axios.get("http://localhost:3002/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      const users = response.data;
      const usersOptions = users
        .filter((user) => user.role === 1)
        .map((user) => ({
          value: user.id,
          label: user.username,
        }));
      usersOptions.unshift({ value: undefined, label: "None" });
      
      setUsersOptions(usersOptions);
      console.log(usersOptions);
    });
  }, []);

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

  const handleDeleteClick = (id) => () => {
    const idDevice = rows.find((row) => row.id === id).idDevice;

    axios
      .delete(`http://localhost:3001/devices/${idDevice}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Device deleted successfully!");
      })
      .catch((error) => {
        alert(error.response.data.message || "An error occurred!");
      });
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
      description: newRow.description || undefined,
      address: newRow.address || undefined,
      energyConsumption: newRow.energyConsumption || undefined,
      userId: newRow.userId? (await axios.get(`http://localhost:3001/users/${newRow.userId}`, { headers: {
        Authorization: `Bearer ${token}`,
      },})).data : undefined
    };

    if (newRow.isNew) {
      const response = await axios.post("http://localhost:3001/devices", rowToDB, { headers: {
        Authorization: `Bearer ${token}`,
      }})
        .catch((error) => {
          alert(error.response.data.message || "Error!");
          return;
        });

        const createdRow = { ...newRow, idDevice: response.data.id, isNew: false };
        setRows((oldRows) => {
          const newRows = [...oldRows];
          const index = oldRows.findIndex((row) => row.id === newRow.id);
          newRows[index] = createdRow;
          return newRows;
        });
        return createdRow;
    }

    const updatedRow = { ...newRow, isNew: false };
    console.log(rowToDB);
    axios
      .patch(`http://localhost:3001/devices/${updatedRow.idDevice}`, rowToDB, { headers: {
        Authorization: `Bearer ${token}`,
      }})
      .then(() => {
        alert("Device updated successfully!");
      })
      .catch((error) => {
        alert(error.response.data.message || "An error occurred!");
      });

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "description",
      headerName: "Description",
      width: 250,
      editable: true,
    },
    {
      field: "address",
      headerName: "Address",
      width: 180,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "energyConsumption",
      headerName: "Energy Consumption",
      type: "number",
      width: 200,
      headerAlign: "left",
      align: "left",
      editable: true,
    },
    {
      field: "userId",
      headerName: "User",
      type: "singleSelect",
      width: 200,
      headerAlign: "left",
      align: "left",
      editable: true,
      valueOptions: [...usersOptions],
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
