import { Button, TextField } from "@mui/material";
import React, { useState } from "react";

// Initial data structure
const initialData = [
  {
    id: "electronics",
    label: "Electronics",
    originalValue: 1500,
    value: 1500,
    variance: 0,
    children: [
      {
        id: "phones",
        label: "Phones",
        originalValue: 800,
        value: 800,
        variance: 0,
      },
      {
        id: "laptops",
        label: "Laptops",
        originalValue: 700,
        value: 700,
        variance: 0,
      },
    ],
  },
  {
    id: "furniture",
    label: "Furniture",
    originalValue: 1000,
    value: 1000,
    variance: 0,
    children: [
      {
        id: "tables",
        label: "Tables",
        originalValue: 300,
        value: 300,
        variance: 0,
      },
      {
        id: "chairs",
        label: "Chairs",
        originalValue: 700,
        value: 700,
        variance: 0,
      },
    ],
  },
];

// Variance calculation function
const calculateVariance = (originalValue, newValue) => {
  return ((newValue - originalValue) / originalValue) * 100;
};

const HierarchicalTable = () => {
  const [tableData, setTableData] = useState(initialData);
  const [inputValues, setInputValues] = useState({}); // to track inputs for each row

  // Handle percentage allocation
  const handleAllocationPercentage = (rowId, percentage) => {
    setTableData((prevData) => {
      return prevData.map((row) => {
        if (row.id === rowId) {
          const newValue = row.value + (row.value * percentage) / 100;
          const variance = calculateVariance(row.originalValue, newValue);
          return { ...row, value: newValue, variance: variance };
        } else if (row.children) {
          const updatedChildren = row.children.map((child) => {
            if (child.id === rowId) {
              const newValue = child.value + (child.value * percentage) / 100;
              const variance = calculateVariance(child.originalValue, newValue);
              return { ...child, value: newValue, variance: variance };
            }
            return child;
          });
          const updatedValue = updatedChildren.reduce(
            (acc, child) => acc + child.value,
            0
          );
          const variance = calculateVariance(row.originalValue, updatedValue);
          return {
            ...row,
            children: updatedChildren,
            value: updatedValue,
            variance: variance,
          };
        }
        return row;
      });
    });
  };

  // Handle value allocation
  const handleAllocationValue = (rowId, newValue) => {
    setTableData((prevData) => {
      return prevData.map((row) => {
        if (row.id === rowId) {
          const variance = calculateVariance(row.originalValue, newValue);
          return { ...row, value: newValue, variance: variance };
        } else if (row.children) {
          const updatedChildren = row.children.map((child) => {
            if (child.id === rowId) {
              const variance = calculateVariance(child.originalValue, newValue);
              return { ...child, value: newValue, variance: variance };
            }
            return child;
          });
          const updatedValue = updatedChildren.reduce(
            (acc, child) => acc + child.value,
            0
          );
          const variance = calculateVariance(row.originalValue, updatedValue);
          return {
            ...row,
            children: updatedChildren,
            value: updatedValue,
            variance: variance,
          };
        }
        return row;
      });
    });
  };

  // Handle input change
  const handleInputChange = (e, rowId) => {
    const { value } = e.target;
    setInputValues({ ...inputValues, [rowId]: value });
  };

  // Calculate Grand Total
  const calculateGrandTotal = () => {
    return tableData.reduce((total, row) => total + row.value, 0);
  };

  return (
    <div>
      <h2 style={{ display: "flex", justifyContent: "center" }}>
        Simple Hierarchical Table Website
      </h2>
      <table border="1">
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow
                row={row}
                handleInputChange={handleInputChange}
                inputValues={inputValues}
                handleAllocationPercentage={handleAllocationPercentage}
                handleAllocationValue={handleAllocationValue}
              />
              {row.children &&
                row.children.map((child) => (
                  <TableRow
                    key={child.id}
                    row={child}
                    isChild={true}
                    handleInputChange={handleInputChange}
                    inputValues={inputValues}
                    handleAllocationPercentage={handleAllocationPercentage}
                    handleAllocationValue={handleAllocationValue}
                  />
                ))}
            </React.Fragment>
          ))}
          {/* Grand Total Row */}
          <tr>
            <td>
              <strong>Grand Total</strong>
            </td>
            <td>
              <strong>{calculateGrandTotal().toFixed(2)}</strong>
            </td>
            <td colSpan="4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Component for rendering individual table rows
const TableRow = ({
  row,
  isChild = false,
  handleInputChange,
  inputValues,
  handleAllocationPercentage,
  handleAllocationValue,
}) => {
  return (
    <tr>
      <td>
        {isChild && "-- "}
        {row.label}
      </td>
      <td>{row.value.toFixed(2)}</td>
      <td>
        <TextField
          type="number"
          value={inputValues[row.id] || ""}
          onChange={(e) => handleInputChange(e, row.id)}
          fullWidth
          variant="outlined"
        />
      </td>
      <td>
        <Button
          variant="outlined"
          onClick={() =>
            handleAllocationPercentage(
              row.id,
              parseFloat(inputValues[row.id] || 0)
            )
          }
        >
          Allocation %
        </Button>
      </td>
      <td>
        <Button
          variant="outlined"
          onClick={() =>
            handleAllocationValue(row.id, parseFloat(inputValues[row.id] || 0))
          }
        >
          Allocation Val
        </Button>
      </td>
      <td>{row.variance && row.variance.toFixed(2)}%</td>
    </tr>
  );
};

export default HierarchicalTable;
