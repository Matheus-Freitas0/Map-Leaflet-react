import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { Box, Typography, Chip } from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import SquareFootIcon from "@mui/icons-material/SquareFoot";

// CSS customizado para clusters azuis
const clusterStyles = `
  .marker-cluster-small,
  .marker-cluster-medium,
  .marker-cluster-large {
    background-color: #1976d2 !important;
    border: 3px solid white !important;
    border-radius: 50% !important;
    width: 50px !important;
    height: 50px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: 0 3px 6px rgba(0,0,0,0.25) !important;
  }
  .marker-cluster-small div,
  .marker-cluster-medium div,
  .marker-cluster-large div {
    background-color: transparent !important;
    border: none !important;
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .marker-cluster-small span,
  .marker-cluster-medium span,
  .marker-cluster-large span {
    color: white !important;
    font-weight: bold !important;
    font-size: 16px !important;
    font-family: 'Roboto', Arial, sans-serif !important;
  }
`;

// Adiciona os estilos ao DOM
if (
  typeof document !== "undefined" &&
  !document.getElementById("cluster-styles")
) {
  const style = document.createElement("style");
  style.id = "cluster-styles";
  style.textContent = clusterStyles;
  document.head.appendChild(style);
}

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Componente para controlar o mapa quando uma propriedade é selecionada
function MapController({
  selectedProperty,
  properties,
  onMapMove,
  zoomOnSelect = true,
  clusterGroupRef,
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedProperty && zoomOnSelect) {
      const property = properties.find((p) => p.id === selectedProperty.id);
      if (property) {
        // Fecha todos os popups antes de fazer zoom
        map.closePopup();

        // Faz o zoom para a propriedade
        map.setView([property.location.lat, property.location.lng], 16, {
          animate: true,
        });

        // Aguarda a animação do zoom terminar e abre o popup apenas uma vez
        const timeoutId = setTimeout(() => {
          if (clusterGroupRef.current) {
            // Encontra o marcador específico no cluster group
            clusterGroupRef.current.eachLayer((layer) => {
              if (layer instanceof L.Marker) {
                const markerLat = layer.getLatLng().lat;
                const markerLng = layer.getLatLng().lng;

                // Verifica se é o marcador correto (com tolerância de 0.0001 graus)
                if (
                  Math.abs(markerLat - property.location.lat) < 0.0001 &&
                  Math.abs(markerLng - property.location.lng) < 0.0001
                ) {
                  // Abre o popup apenas se não estiver já aberto
                  if (!layer.isPopupOpen()) {
                    layer.openPopup();
                  }
                }
              }
            });
          }
        }, 1000); // Aguarda 1 segundo para a animação do zoom terminar

        // Cleanup do timeout se o componente for desmontado ou o efeito for executado novamente
        return () => {
          clearTimeout(timeoutId);
        };
      }
    }
  }, [selectedProperty?.id, zoomOnSelect]); // Removido properties, map e clusterGroupRef das dependências

  useEffect(() => {
    let timeoutId;

    const handleMoveEnd = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const bounds = map.getBounds();
        const zoom = map.getZoom();
        const center = map.getCenter();

        onMapMove({
          bounds: {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          },
          zoom: zoom,
          center: center,
        });
      }, 300); // Reduzido para 300ms para melhor responsividade
    };

    map.on("moveend", handleMoveEnd);
    map.on("zoomend", handleMoveEnd);

    // Chama uma vez para inicializar
    handleMoveEnd();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      map.off("moveend", handleMoveEnd);
      map.off("zoomend", handleMoveEnd);
    };
  }, [map, onMapMove]);

  return null;
}

// Componente MarkerCluster usando Leaflet diretamente
function MarkerCluster({
  markers,
  onMarkerClick,
  onOpenDetails,
  clusterGroupRef,
}) {
  const map = useMap();

  useEffect(() => {
    if (!markers || markers.length === 0) return;

    // Remove o cluster group anterior se existir
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
    }

    // Adiciona evento para fechar popups ao clicar no mapa
    const handleMapClick = (e) => {
      // Verifica se clicou em um marcador ou popup
      const target = e.originalEvent.target;
      const isMarker = target.closest(".leaflet-marker-icon");
      const isPopup = target.closest(".leaflet-popup");

      // Só fecha popup se não clicou em marcador ou popup
      if (!isMarker && !isPopup) {
        map.closePopup();
      }
    };

    map.on("click", handleMapClick);

    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: false,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 60,
      disableClusteringAtZoom: 17,
      iconCreateFunction: function (cluster) {
        const childCount = cluster.getChildCount();

        return L.divIcon({
          html: `<div style="
            background-color: #1976d2;
            border: 3px solid white;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 6px rgba(0,0,0,0.25);
          ">
            <span style="
              color: white;
              font-weight: bold;
              font-size: 16px;
              font-family: 'Roboto', Arial, sans-serif;
            ">${childCount}</span>
          </div>`,
          className: "custom-cluster",
          iconSize: L.point(50, 50),
        });
      },
    });

    markers.forEach((property) => {
      if (!property.location.lat || !property.location.lng) {
        return;
      }

      const marker = L.marker([property.location.lat, property.location.lng]);

      // Cria popup com elementos clicáveis
      const popupContent = document.createElement("div");
      popupContent.style.cssText =
        "max-width: 280px; font-family: 'Roboto', Arial, sans-serif;";

      // Imagem clicável
      const img = document.createElement("img");
      img.src = property.images[0];
      img.alt = property.title;
      img.style.cssText =
        "width: 100%; height: 140px; object-fit: cover; border-radius: 4px; margin-bottom: 12px; cursor: pointer; transition: opacity 0.2s;";
      img.addEventListener("click", () => onOpenDetails(property));
      img.addEventListener("mouseover", () => (img.style.opacity = "0.8"));
      img.addEventListener("mouseout", () => (img.style.opacity = "1"));

      // Título
      const title = document.createElement("h4");
      title.textContent = property.title;
      title.style.cssText =
        "margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #333; line-height: 1.4;";

      // Preço
      const price = document.createElement("p");
      price.textContent = `R$ ${property.price.toLocaleString("pt-BR")}/mês`;
      price.style.cssText =
        "margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #1976d2;";

      // Localização
      const location = document.createElement("div");
      location.innerHTML = `<div style="display: flex; align-items: center; margin-bottom: 4px; font-size: 13px; color: #666;">📍 ${property.location.neighborhood}</div>`;

      // Detalhes
      const details = document.createElement("div");
      details.style.cssText =
        "display: flex; gap: 8px; flex-wrap: wrap; font-size: 12px;";
      details.innerHTML = `
        <span style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 12px; background: #f5f5f5;">🏠 ${
          property.area
        }m²</span>
        <span style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 12px; background: #f5f5f5;">🛏️ ${
          property.bedrooms
        } quartos</span>
        <span style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 12px; background: #f5f5f5;">🚿 ${
          property.bathrooms
        } banheiros</span>
        ${
          property.parkingSpaces > 0
            ? `<span style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 12px; background: #f5f5f5;">🚗 ${property.parkingSpaces} vagas</span>`
            : ""
        }
      `;

      // Botão Ver Detalhes
      const button = document.createElement("button");
      button.textContent = "Ver Detalhes";
      button.style.cssText =
        "background: #1976d2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; width: 100%; margin-top: 12px;";
      button.addEventListener("click", () => onOpenDetails(property));

      // Monta o popup
      popupContent.appendChild(img);
      popupContent.appendChild(title);
      popupContent.appendChild(price);
      popupContent.appendChild(location);
      popupContent.appendChild(details);
      popupContent.appendChild(button);

      marker.bindPopup(popupContent, {
        closeButton: true,
        autoClose: true,
        closeOnClick: false,
        maxWidth: 300,
        keepInView: true,
        className: "custom-popup",
      });

      marker.on("click", (e) => {
        // Para propagação para evitar conflitos
        e.originalEvent.stopPropagation();

        // Fecha outros popups antes de abrir este
        map.closePopup();

        // Força abertura do popup com delay para garantir que abra
        setTimeout(() => {
          if (!marker.isPopupOpen()) {
            marker.openPopup();
          }
        }, 10);

        // Seleciona o imóvel na lista
        onMarkerClick(property);
      });

      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
      }
      map.off("click", handleMapClick);
    };
  }, [map, markers]);

  return null;
}
const mapStyles = {
  osm: {
    name: "OpenStreetMap (Clássico)",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  },
};

// Componente principal do mapa
function PropertyMap({
  properties,
  selectedProperty,
  onPropertySelect,
  onMapMove,
  zoomOnSelect = true,
  onOpenDetails,
}) {
  const center = [-23.5505, -46.6333];
  const clusterGroupRef = useRef(null);
  const currentStyle = mapStyles.osm;

  return (
    <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        center={center}
        zoom={11}
        minZoom={10}
        maxZoom={18}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution={currentStyle.attribution}
          url={currentStyle.url}
        />

        <MarkerCluster
          markers={properties}
          onMarkerClick={onPropertySelect}
          onOpenDetails={onOpenDetails}
          clusterGroupRef={clusterGroupRef}
        />

        <MapController
          selectedProperty={selectedProperty}
          properties={properties}
          onMapMove={onMapMove}
          zoomOnSelect={zoomOnSelect}
          clusterGroupRef={clusterGroupRef}
        />
      </MapContainer>
    </Box>
  );
}

export default PropertyMap;
