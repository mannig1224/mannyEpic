"use client"


import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel
} from "@mui/material";
import devicesRaw from "./mockDevices.json"; 
import styles from "./DevicesTable.module.css";



// Define TypeScript interface for device data
interface Device {
  ID: number;
  deviceName: string;
  deviceType: string;
  status: string;
  IP: string;
  MAC: string;
  extension: number;
  action: string;
}

type Order = "asc" | "desc";

// Transform the raw data to match the TypeScript interface
const devicesData: Device[] = devicesRaw.map((device) => ({
  ID: device.ID,
  deviceName: device["Device Name"],
  deviceType: device["Device Type"],
  status: device.Status,
  IP: device.IP,
  MAC: device.MAC,
  extension: device.Extension,
  action: device.Action,
}));

const DevicesTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Device>("ID");

// Sort data
const sortData = (data: Device[]) => {
  return [...data].sort((a, b) => {
    const valueA = a[orderBy];
    const valueB = b[orderBy];

    if (valueA < valueB) return order === "asc" ? -1 : 1;
    if (valueA > valueB) return order === "asc" ? 1 : -1;
    return 0;
  });
};

const handleSort = (property: keyof Device) => {
  const isAscending = orderBy === property && order === "asc";
  setOrder(isAscending ? "desc" : "asc");
  setOrderBy(property);
};

  // Paginate and sort data
  const sortedData = sortData(devicesData);
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
    // Handle page change
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };

      // Handle rows per page change
    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0); // Reset to first page
    };

    return (
      <TableContainer component={Paper} className={styles.tableContainer}>
        {/* Header */}
        <div className={styles.header}>
          <h1>Known Devices</h1>
        </div>
        <Table>
          {/* Table Header */}
          <TableHead>
            <TableRow>
            <TableCell className={styles.tableHeader}>
              <TableSortLabel
                active={orderBy === "ID"}
                direction={orderBy === "ID" ? order : "asc"}
                onClick={() => handleSort("ID")}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell className={styles.tableHeader}>
              <TableSortLabel
                active={orderBy === "deviceName"}
                direction={orderBy === "deviceName" ? order : "asc"}
                onClick={() => handleSort("deviceName")}
              >
                Device Name
              </TableSortLabel>
            </TableCell>
            <TableCell className={styles.tableHeader}>
              <TableSortLabel
                active={orderBy === "deviceType"}
                direction={orderBy === "deviceType" ? order : "asc"}
                onClick={() => handleSort("deviceType")}
              >
                Device Type
              </TableSortLabel>
            </TableCell>
            <TableCell className={styles.tableHeader}>Status</TableCell>
            <TableCell className={styles.tableHeader}>
              <TableSortLabel
                active={orderBy === "IP"}
                direction={orderBy === "IP" ? order : "asc"}
                onClick={() => handleSort("IP")}
              >
                IP
              </TableSortLabel>
            </TableCell>
            <TableCell className={styles.tableHeader}>MAC</TableCell>
            <TableCell className={styles.tableHeader}>
              <TableSortLabel
                active={orderBy === "extension"}
                direction={orderBy === "extension" ? order : "asc"}
                onClick={() => handleSort("extension")}

              >
                Extension
              </TableSortLabel>
            </TableCell>
            <TableCell className={styles.tableHeader}>Action</TableCell>
            </TableRow>
          </TableHead>
  
          {/* Table Body */}
          <TableBody>
            {paginatedData.map((device: Device, index) => (
              <TableRow
                key={device.ID}
                className={`${styles.tableRow} ${
                  index % 2 === 0 ? styles.rowEven : styles.rowOdd
                }`}
              >
                <TableCell className={styles.dataCell}>{device.ID}</TableCell>
                <TableCell className={styles.dataCell}>
                  {device.deviceName}
                </TableCell>
                <TableCell className={styles.dataCell}>
                  {device.deviceType}
                </TableCell>
                <TableCell className={styles.dataCell}>{device.status}</TableCell>
                <TableCell className={styles.dataCell}>{device.IP}</TableCell>
                <TableCell className={styles.dataCell}>{device.MAC}</TableCell>
                <TableCell className={styles.dataCell}>
                  {device.extension}
                </TableCell>
                <TableCell className={styles.actionCell}>
                  {device.action}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={devicesData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    );
  };

export default DevicesTable;
