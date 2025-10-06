import React from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
} from "@mui/material";
import { propertyTypes, priceRanges } from "../data/mockProperties";

function PropertyFilters({ filters, onFilterChange }) {
  const handleTypeChange = (event) => {
    onFilterChange({
      ...filters,
      type: event.target.value,
    });
  };

  const handlePriceChange = (event) => {
    onFilterChange({
      ...filters,
      priceRange: event.target.value,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="type-filter-label">Tipo de Imóvel</InputLabel>
          <Select
            labelId="type-filter-label"
            id="type-filter"
            value={filters.type || "todos"}
            label="Tipo de Imóvel"
            onChange={handleTypeChange}
          >
            {propertyTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="price-filter-label">Faixa de Preço</InputLabel>
          <Select
            labelId="price-filter-label"
            id="price-filter"
            value={filters.priceRange || "todos"}
            label="Faixa de Preço"
            onChange={handlePriceChange}
          >
            {priceRanges.map((range) => (
              <MenuItem key={range.value} value={range.value}>
                {range.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
}

export default PropertyFilters;
