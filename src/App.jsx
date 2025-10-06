import React, { useState, useMemo, useCallback } from "react";
import { Box, Container, Grid, Paper } from "@mui/material";
import PropertyMap from "./components/PropertyMap";
import PropertyList from "./components/PropertyList";
import PropertyFilters from "./components/PropertyFilters";
import { mockProperties } from "./data/mockProperties";
import "./App.css";

function App() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [zoomOnSelect, setZoomOnSelect] = useState(true);
  const [filters, setFilters] = useState({
    type: "todos",
    priceRange: "todos",
  });

  // Filtra propriedades por tipo e preço
  const filteredByFilters = useMemo(() => {
    return mockProperties.filter((property) => {
      // Filtro por tipo
      if (filters.type !== "todos" && property.type !== filters.type) {
        return false;
      }

      // Filtro por faixa de preço
      if (filters.priceRange !== "todos") {
        const [min, max] = filters.priceRange
          .split("-")
          .map((p) => (p === "+" ? Infinity : parseInt(p)));
        if (
          property.price < min ||
          (max !== Infinity && property.price > max)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Propriedades para mostrar na lista (filtradas por filtros E visíveis no mapa)
  const listProperties = useMemo(() => {
    if (!mapBounds) {
      return filteredByFilters;
    }

    return filteredByFilters.filter((property) => {
      const lat = property.location.lat;
      const lng = property.location.lng;

      return (
        lat >= mapBounds.south &&
        lat <= mapBounds.north &&
        lng >= mapBounds.west &&
        lng <= mapBounds.east
      );
    });
  }, [filteredByFilters, mapBounds]);

  const handlePropertySelectFromList = useCallback((property) => {
    setZoomOnSelect(true); // Permite zoom quando vem da lista
    setSelectedProperty(property);
  }, []);

  const handlePropertySelectFromMap = useCallback((property) => {
    setZoomOnSelect(false); // Não permite zoom quando vem do mapa
    setSelectedProperty(property);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setSelectedProperty(null);
  }, []);

  const handleOpenDetails = useCallback((property) => {
    // Aqui você pode implementar a navegação para detalhes
    // Por exemplo: navigate(`/property/${property.id}`)
    console.log("Abrindo detalhes do imóvel:", property);
    alert(
      `Detalhes do imóvel: ${
        property.title
      }\nPreço: R$ ${property.price.toLocaleString(
        "pt-BR"
      )}/mês\nLocalização: ${property.location.neighborhood}`
    );
  }, []);

  const handleMapMove = useCallback((mapData) => {
    // Atualiza sempre para que a lista acompanhe o movimento do mapa
    const newBounds = mapData.bounds;
    setMapBounds(newBounds);
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Header com filtros */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Container maxWidth="xl">
          <PropertyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </Container>
      </Box>

      {/* Conteúdo principal: Lista + Mapa */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <Grid container sx={{ height: "100%" }} spacing={0}>
          {/* Lista de propriedades */}
          <Grid
            size={{ xs: 12, md: 5, lg: 4 }}
            sx={{
              height: "100%",
              overflow: "auto",
            }}
          >
            <PropertyList
              properties={listProperties}
              selectedProperty={selectedProperty}
              onPropertySelect={handlePropertySelectFromList}
              onOpenDetails={handleOpenDetails}
            />
          </Grid>

          {/* Mapa */}
          <Grid
            size={{ xs: 12, md: 7, lg: 8 }}
            sx={{
              height: "100%",
            }}
          >
            <PropertyMap
              properties={listProperties}
              selectedProperty={selectedProperty}
              onPropertySelect={handlePropertySelectFromMap}
              onMapMove={handleMapMove}
              zoomOnSelect={zoomOnSelect}
              onOpenDetails={handleOpenDetails}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
