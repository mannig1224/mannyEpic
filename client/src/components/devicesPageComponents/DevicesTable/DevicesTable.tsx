"use client";

import React, { useState } from "react";
import {
  // Material-UI Components for building the table and UI elements
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query"; 
import styles from "./DevicesTable.module.css"; 

// Font Awesome Components and Icons for action buttons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faTrash,
  faSyncAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

// TypeScript interface defining the structure of a Device object
interface Device {
  deviceName: string;
  deviceType: string;
  status: string;
  IP: string;
  MAC: string;
  extension: string; 
  action?: string; 
}

// Type for sorting order
type Order = "asc" | "desc";

/**
 * Function to fetch devices from the backend API.
 * It transforms the raw data into an array of Device objects.
 */
const fetchDevices = async (): Promise<Device[]> => {
  const res = await fetch("http://localhost:5000/api/devices");

  // Check if the response is successful
  if (!res.ok) {
    throw new Error("Failed to fetch devices");
  }

  const devices = await res.json();

  // Transform the fetched data into Device objects
  return devices.map((device: any) => ({
    deviceName: String(device.deviceName),
    deviceType: String(device.deviceType),
    status: String(device.status),
    IP: String(device.IP),
    MAC: String(device.MAC),
    extension: String(device.extension),
    action: device.action ? String(device.action) : undefined,
  }));
};

/**
 * The main DevicesTable component that displays a list of devices
 * with actions such as Notify (Bell), Delete, Reboot, and Edit.
 */
const DevicesTable: React.FC = () => {
  /** State variables for table pagination */
  const [page, setPage] = useState(0); // Current page number
  const [rowsPerPage, setRowsPerPage] = useState(10); // Number of rows per page

  /** State variables for table sorting */
  const [order, setOrder] = useState<Order>("asc"); // Sorting order: ascending or descending
  const [orderBy, setOrderBy] = useState<keyof Device>("deviceName"); // Column to sort by

  /** State variables for Delete Confirmation Dialog */
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Controls dialog visibility
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null); // Device selected for deletion

  /** State variables for Snackbar Notifications */
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Controls Snackbar visibility
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success"); // Severity level of the Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Message to display in the Snackbar

  /**
   * Fetch devices using React Query.
   * - queryKey: Unique identifier for the query.
   * - queryFn: Function to fetch the data.
   * - refetchInterval: Automatically refetch data every 5 seconds.
   */
  const { data: devicesData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
    refetchInterval: 5000, // Refetch data every 5 seconds
  });


  /**
   * Function to sort the devices data based on the current sort state.
   * @param data - Array of Device objects to sort.
   * @returns Sorted array of Device objects.
   */
  const sortData = (data: Device[]) => {
    return [...data].sort((a, b) => {
      const valueA = a[orderBy];
      const valueB = b[orderBy];

      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  /**
   * Handler for sorting when a table header is clicked.
   * Toggles the sorting order if the same column is clicked.
   * @param property - The column to sort by.
   */
  const handleSort = (property: keyof Device) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc"); // Toggle sort order
    setOrderBy(property); // Set the column to sort by
  };

  /**
   * Handler for changing the current page in pagination.
   * @param event - The event object.
   * @param newPage - The new page number.
   */
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * Handler for changing the number of rows per page in pagination.
   * Resets the page to the first page.
   * @param event - The change event.
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update rows per page
    setPage(0); // Reset to first page
  };

  /**
   * Conditional rendering based on the data fetching state.
   * - Shows a loading spinner while data is being fetched.
   * - Shows an error alert if data fetching fails.
   */
  if (isLoading)
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );

  if (isError)
    return <Alert severity="error">{(error as Error).message}</Alert>;

  /**
   * Data processing:
   * - Ensures that devicesData is an array.
   * - Sorts the data based on the current sort state.
   * - Paginates the sorted data.
   */
  const cleanDevicesData = Array.isArray(devicesData) ? devicesData : [];
  const sortedData = sortData(cleanDevicesData);
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /**
   * Handler for the Bell (Notify) action.
   * Sends a POST request to the backend API to trigger a bell notification.
   * @param device - The Device object to notify.
   */
  const handleBellClick = async (device: Device) => {
    const deviceIP = device.IP;
    const devicePort = 4444; // Fixed port as per requirement

    try {
      // Send POST request to trigger bell notification
      const response = await fetch("http://localhost:5000/api/playBell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceIP,
          devicePort,
        }),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Failed to send bell notification.");
      }

      // Optionally handle the response data
      const data = await response.json();
      console.log("Bell Response:", data);

      // Show success notification to the user
      setSnackbarSeverity("success");
      setSnackbarMessage(
        `Bell notification sent to ${device.deviceName} (${deviceIP}:${devicePort})`
      );
      setSnackbarOpen(true);
    } catch (error: any) {
      console.error("Error sending bell notification:", error);

      // Show error notification to the user
      setSnackbarSeverity("error");
      setSnackbarMessage(
        `Error sending bell to ${device.deviceName}: ${error.message}`
      );
      setSnackbarOpen(true);
    }
  };

  /**
   * Handler for the Delete action.
   * Opens the delete confirmation dialog for the selected device.
   * @param device - The Device object to delete.
   */
  const handleDeleteClick = (device: Device) => {
    setSelectedDevice(device); // Set the selected device for deletion
    setOpenDeleteDialog(true); // Open the confirmation dialog
  };

  /**
   * Handler for the Reboot action.
   * Placeholder function to implement reboot logic.
   * @param device - The Device object to reboot.
   */
  const handleRebootClick = (device: Device) => {
    console.log(`Reboot clicked for device: ${device.deviceName}`);
    // Implement reboot logic here
  };

  /**
   * Handler for the Edit action.
   * Placeholder function to implement edit logic.
   * @param device - The Device object to edit.
   */
  const handleEditClick = (device: Device) => {
    console.log(`Edit clicked for device: ${device.deviceName}`);
    // Implement edit logic here, such as opening an edit form or navigating to an edit page
  };

  /**
   * Handler to confirm deletion of a device.
   * Sends a DELETE request to the backend API to remove the device.
   */
  const handleConfirmDelete = async () => {
    if (selectedDevice) {
      try {
        // Send DELETE request to remove the device
        const response = await fetch(
          `http://localhost:5000/api/devices/${encodeURIComponent(
            selectedDevice.deviceName
          )}`,
          {
            method: "DELETE",
          }
        );

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Failed to delete device");
        }

        // Refetch the devices data to update the table
        refetch();

        // Show success notification to the user
        setSnackbarSeverity("success");
        setSnackbarMessage(
          `Device "${selectedDevice.deviceName}" deleted successfully.`
        );
        setSnackbarOpen(true);
      } catch (error: any) {
        console.error(error);

        // Show error notification to the user
        setSnackbarSeverity("error");
        setSnackbarMessage(
          `Error deleting device "${selectedDevice.deviceName}": ${error.message}`
        );
        setSnackbarOpen(true);
      } finally {
        // Close the delete confirmation dialog and reset selected device
        setOpenDeleteDialog(false);
        setSelectedDevice(null);
      }
    }
  };

  /**
   * Handler to cancel the deletion process.
   * Closes the delete confirmation dialog without deleting the device.
   */
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false); // Close the dialog
    setSelectedDevice(null); // Reset the selected device
  };

  /**
   * Handler to close the Snackbar notification.
   * Prevents closing if the user clicks away.
   * @param event - The event object.
   * @param reason - The reason for closing.
   */
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return; // Do not close if the user clicked away
    }
    setSnackbarOpen(false); // Close the Snackbar
  };

  /**
   * The JSX structure of the DevicesTable component.
   * Includes the table with sortable headers, action buttons, pagination,
   * delete confirmation dialog, and Snackbar notifications.
   */
  return (
    <>
      {/* Table Container */}
      <TableContainer component={Paper} className={styles.tableContainer}>
        {/* Table Header */}
        <div className={styles.header}>
          <h1>Known Devices</h1>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              {/* Device Name Column with Sorting */}
              <TableCell className={styles.tableHeader}>
                <TableSortLabel
                  active={orderBy === "deviceName"}
                  direction={orderBy === "deviceName" ? order : "asc"}
                  onClick={() => handleSort("deviceName")}
                >
                  Device Name
                </TableSortLabel>
              </TableCell>

              {/* Device Type Column with Sorting */}
              <TableCell className={styles.tableHeader}>
                <TableSortLabel
                  active={orderBy === "deviceType"}
                  direction={orderBy === "deviceType" ? order : "asc"}
                  onClick={() => handleSort("deviceType")}
                >
                  Device Type
                </TableSortLabel>
              </TableCell>

              {/* Status Column with Sorting */}
              <TableCell className={styles.tableHeader}>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>

              {/* IP Column with Sorting */}
              <TableCell className={styles.tableHeader}>
                <TableSortLabel
                  active={orderBy === "IP"}
                  direction={orderBy === "IP" ? order : "asc"}
                  onClick={() => handleSort("IP")}
                >
                  IP
                </TableSortLabel>
              </TableCell>

              {/* MAC Column with Sorting */}
              <TableCell className={styles.tableHeader}>
                <TableSortLabel
                  active={orderBy === "MAC"}
                  direction={orderBy === "MAC" ? order : "asc"}
                  onClick={() => handleSort("MAC")}
                >
                  MAC
                </TableSortLabel>
              </TableCell>

              {/* Extension Column with Sorting */}
              <TableCell className={styles.tableHeader}>
                <TableSortLabel
                  active={orderBy === "extension"}
                  direction={orderBy === "extension" ? order : "asc"}
                  onClick={() => handleSort("extension")}
                >
                  Extension
                </TableSortLabel>
              </TableCell>

              {/* Action Column Header */}
              <TableCell className={styles.tableHeader}>Action</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {paginatedData.map((device: Device, index) => (
              <TableRow
                key={index}
                className={`${styles.tableRow} ${
                  index % 2 === 0 ? styles.rowEven : styles.rowOdd
                }`}
              >
                {/* Device Name Cell */}
                <TableCell>{device.deviceName}</TableCell>

                {/* Device Type Cell */}
                <TableCell>{device.deviceType}</TableCell>

                {/* Status Cell with Colored Indicator */}
                <TableCell>
                  <span
                    style={{
                      display: "inline-block",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor:
                        device.status === "Alive" ? "green" : "red",
                      marginRight: "8px",
                    }}
                  ></span>
                  {device.status}
                </TableCell>

                {/* IP Address Cell */}
                <TableCell>{device.IP}</TableCell>

                {/* MAC Address Cell */}
                <TableCell>{device.MAC}</TableCell>

                {/* Extension Cell */}
                <TableCell>{device.extension}</TableCell>

                {/* Action Buttons Cell */}
                <TableCell>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {/* Bell (Notify) Button */}
                    <Tooltip title="Notify">
                      <IconButton
                        aria-label="notify"
                        onClick={() => handleBellClick(device)}
                        style={{ color: "goldenrod" }}
                      >
                        <FontAwesomeIcon icon={faBell} />
                      </IconButton>
                    </Tooltip>

                    {/* Trash (Delete) Button */}
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteClick(device)}
                        style={{ color: "red" }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </Tooltip>

                    {/* Reboot Button */}
                    <Tooltip title="Reboot">
                      <IconButton
                        aria-label="reboot"
                        onClick={() => handleRebootClick(device)}
                        style={{ color: "orange" }}
                      >
                        <FontAwesomeIcon icon={faSyncAlt} />
                      </IconButton>
                    </Tooltip>

                    {/* Edit Button */}
                    <Tooltip title="Edit">
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEditClick(device)}
                        style={{ color: "blue" }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={cleanDevicesData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete device "{selectedDevice?.deviceName}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* Cancel Button */}
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          {/* Confirm Delete Button */}
          <Button
            onClick={handleConfirmDelete}
            color="secondary"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification for Feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Duration the Snackbar is visible (in milliseconds)
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Position of the Snackbar
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity} // Severity level (success, error, etc.)
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled" // Filled variant for better visibility
        >
          {snackbarMessage} {/* Message to display */}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default DevicesTable;
