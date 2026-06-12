import React from "react";
import {
  Autocomplete as MuiAutocomplete,
  Box,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import { GoogleMap, Marker } from "@react-google-maps/api";
import AddNewRiderSectionHeader from "./AddNewRiderSectionHeader";
import { MAP_CONTAINER, fieldSx } from "./AddNewRiderHelpers";

interface AddNewRiderLocationProps {
  isLoaded: boolean;
  currentAddress: string;
  addressOptions: string[];
  addressLoading: boolean;
  mapCenter: { lat: number; lng: number };
  markerPos: { lat: number; lng: number };
  onAddressInput: (value: string) => void;
  onAddressSelect: (e: React.SyntheticEvent, value: string | null) => void;
  onMapLoad: () => void;
  onMapClick: (e: google.maps.MapMouseEvent) => void;
  onMarkerDragEnd: (e: google.maps.MapMouseEvent) => void;
}

const AddNewRiderLocation: React.FC<AddNewRiderLocationProps> = ({
  isLoaded,
  currentAddress,
  addressOptions,
  addressLoading,
  mapCenter,
  markerPos,
  onAddressInput,
  onAddressSelect,
  onMapLoad,
  onMapClick,
  onMarkerDragEnd,
}) => (
  <Box sx={{ px: 3, pt: 2.5, pb: 3 }}>
    <AddNewRiderSectionHeader
      icon={<LocationOnIcon sx={{ fontSize: 16 }} />}
      title="Location & Service Area"
    />

    <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", mb: 0.8 }}>
      Search Address <span style={{ color: "#ef4444" }}>*</span>
    </Typography>
    <MuiAutocomplete
      freeSolo
      options={addressOptions}
      inputValue={currentAddress}
      onInputChange={(_, value) => onAddressInput(value)}
      onChange={onAddressSelect}
      loading={addressLoading}
      filterOptions={(x) => x}
      noOptionsText={
        currentAddress.trim()
          ? addressLoading
            ? "Searching…"
            : "No matches"
          : "Type to search"
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search full address, landmark or pin..."
          size="small"
          slotProps={{
            ...params.slotProps,
            input: {
              ...(params as any).InputProps, // eslint-disable-line @typescript-eslint/no-explicit-any
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 15, color: "#d1d5db" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ ...fieldSx, mb: 2 }}
        />
      )}
    />

    <Box sx={{ border: "1px solid #e5e7eb", borderRadius: 2, overflow: "hidden" }}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER}
          center={mapCenter}
          zoom={13}
          onLoad={onMapLoad}
          onClick={onMapClick}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker position={markerPos} draggable onDragEnd={onMarkerDragEnd} />
        </GoogleMap>
      ) : (
        <Box
          sx={{
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f3f4f6",
          }}
        >
          <Typography sx={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            Loading map…
          </Typography>
        </Box>
      )}
    </Box>
  </Box>
);

export default AddNewRiderLocation;
