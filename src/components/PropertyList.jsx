import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Paper,
  Button,
  ButtonGroup,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import VisibilityIcon from "@mui/icons-material/Visibility";

function PropertyCard({
  property,
  isSelected,
  onPropertySelect,
  onOpenDetails,
}) {
  const handleCardClick = (e) => {
    // Só seleciona se não clicou nos botões
    if (!e.target.closest("button")) {
      onPropertySelect(property);
    }
  };

  const handleLocateClick = (e) => {
    e.stopPropagation();
    onPropertySelect(property);
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    onOpenDetails(property);
  };

  return (
    <Card
      sx={{
        mb: 2,
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: isSelected ? "2px solid #1976d2" : "2px solid transparent",
        boxShadow: isSelected ? 4 : 1,
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        component="img"
        height="180"
        image={property.images[0]}
        alt={property.title}
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "#333",
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {property.title}
        </Typography>

        <Typography
          variant="h5"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 700, mb: 1 }}
        >
          R$ {property.price.toLocaleString("pt-BR")}/mês
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            color: "#666",
          }}
        >
          <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
          <Typography variant="body2">
            {property.location.neighborhood}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            mt: 2,
          }}
        >
          <Chip
            icon={<SquareFootIcon />}
            label={`${property.area}m²`}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<BedIcon />}
            label={`${property.bedrooms} quartos`}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<BathtubIcon />}
            label={`${property.bathrooms} banheiros`}
            size="small"
            variant="outlined"
          />
          {property.parkingSpaces > 0 && (
            <Chip
              icon={<DriveEtaIcon />}
              label={`${property.parkingSpaces} vagas`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {property.description}
        </Typography>

        {/* Botões de ação */}
        <Box sx={{ mt: 2 }}>
          <ButtonGroup
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              "& .MuiButton-root": {
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "none",
              },
            }}
          >
            <Button
              startIcon={<MyLocationIcon />}
              onClick={handleLocateClick}
              sx={{
                color: "#1976d2",
                borderColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  borderColor: "#1976d2",
                },
              }}
            >
              Localizar
            </Button>
            <Button
              startIcon={<VisibilityIcon />}
              onClick={handleDetailsClick}
              sx={{
                color: "#4caf50",
                borderColor: "#4caf50",
                "&:hover": {
                  backgroundColor: "#4caf50",
                  color: "white",
                  borderColor: "#4caf50",
                },
              }}
            >
              Ver Detalhes
            </Button>
          </ButtonGroup>
        </Box>
      </CardContent>
    </Card>
  );
}

function PropertyList({
  properties,
  selectedProperty,
  onPropertySelect,
  onOpenDetails,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        overflow: "auto",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {properties.length} Imóveis encontrados
        </Typography>
      </Box>

      <Box>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isSelected={selectedProperty?.id === property.id}
            onPropertySelect={onPropertySelect}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </Box>
    </Paper>
  );
}

export default PropertyList;
