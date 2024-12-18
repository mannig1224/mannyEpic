"use client";

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
  TableSortLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import styles from "./DevicesTable.module.css";

// Define TypeScript interface for device data
interface Device {
  deviceName: string;
  deviceType: string;
  status: string;
  IP: string;
  MAC: string;
  extension: string; // Ensure this matches your backend
  action: string;
}

type Order = "asc" | "desc";

const fetchDevices = async (): Promise<Device[]> => {
  const res = await fetch("http://localhost:5000/api/devices");
  if (!res.ok) {
    throw new Error("Failed to fetch devices");
  }

  const data = await res.text(); // Fetch as string
  const parsedData = JSON.parse(data); // Parse the string back to JSON

  console.log("Parsed Data:", parsedData);

  return parsedData.map((device: any) => ({
    deviceName: String(device.deviceName),
    deviceType: String(device.deviceType),
    status: String(device.status),
    IP: String(device.IP),
    MAC: String(device.MAC),
    extension: String(device.extension),
    action: String(device.action),
  }));
};


const DevicesTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Device>("deviceName");

  // Fetch data with React Query
  const { data: devicesData, isLoading, isError, error } = useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
  });

  console.log("Devices Data:", devicesData);

  // Sorting function
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

  const cleanDevicesData = Array.isArray(devicesData) ? devicesData : [];
  const sortedData = sortData(cleanDevicesData);
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper} className={styles.tableContainer}>
      <div className={styles.header}>
        <h1>Known Devices</h1>
      </div>
      <Table>
        {/* Table Header */}
        <TableHead>
          <TableRow>
            <TableCell className={styles.tableHeader}>
              <TableSortLabel
                active={orderBy === "deviceName"}
                direction={orderBy === "deviceName" ? order : "asc"}
                onClick={() => handleSort("deviceName")}
              >
                Device Name
              </TableSortLabel>
            </TableCell>
            <TableCell className={styles.tableHeader}>Device Type</TableCell>
            <TableCell className={styles.tableHeader}>Status</TableCell>
            <TableCell className={styles.tableHeader}>IP</TableCell>
            <TableCell className={styles.tableHeader}>MAC</TableCell>
            <TableCell className={styles.tableHeader}>Extension</TableCell>
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
              <TableCell>{device.deviceName}</TableCell>
              <TableCell>{device.deviceType}</TableCell>
              <TableCell>{device.status}</TableCell>
              <TableCell>{device.IP}</TableCell>
              <TableCell>{device.MAC}</TableCell>
              <TableCell>{device.extension}</TableCell>
              <TableCell>{device.action}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
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
  );
};

export default DevicesTable;
