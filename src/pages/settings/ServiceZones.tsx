import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { fetchZoneSettings } from "../../redux/sagas/serviceZones/zoneSettingsAction";
import {
  fetchZoneConfig,
  updateZoneConfig,
} from "../../redux/sagas/serviceZones/zoneConfigAction";
import type { RootState } from "../../redux/stores/store";
import type { Zone } from "./ServiceZonesHelpers";
import ServiceZonesAddView from "./ServiceZonesAddView";
import ServiceZonesEditView from "./ServiceZonesEditView";
import ServiceZonesTable from "./ServiceZonesTable";
import ServiceZonesConfig, { type ZoneConfigState } from "./ServiceZonesConfig";

const ServiceZones: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.zoneSettings,
  );

  const { data: zoneConfigData } = useSelector(
    (state: RootState) => state.zoneConfig,
  );

  const [addingZone, setAddingZone] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  const [zoneConfig, setZoneConfig] = useState<ZoneConfigState>({
    defaultRadiusKm: "",
    overlapAllowed: "",
    autoExpandOnHighDemand: "",
  });

  useEffect(() => {
    dispatch(fetchZoneSettings());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchZoneConfig());
  }, [dispatch]);

  useEffect(() => {
    if (zoneConfigData?.zoneConfig) {
      const config = zoneConfigData.zoneConfig;
      setZoneConfig({
        defaultRadiusKm: String(config.defaultRadiusKm ?? ""),
        overlapAllowed: config.overlapAllowed ? "Yes" : "No",
        autoExpandOnHighDemand: config.autoExpandOnHighDemand
          ? "Enabled"
          : "Disabled",
      });
    }
  }, [zoneConfigData]);

  const handleSaveConfig = () => {
    dispatch(
      updateZoneConfig({
        defaultRadiusKm: parseFloat(zoneConfig.defaultRadiusKm),
        overlapAllowed: zoneConfig.overlapAllowed === "Yes",
        autoExpandOnHighDemand: zoneConfig.autoExpandOnHighDemand === "Enabled",
      }),
    );
  };

  if (addingZone)
    return <ServiceZonesAddView onBack={() => setAddingZone(false)} />;
  if (editingZone)
    return (
      <ServiceZonesEditView
        zone={editingZone}
        onBack={() => setEditingZone(null)}
      />
    );
  if (loading)
    return (
      <Typography sx={{ p: 2, color: "#9ca3af" }}>Loading zones...</Typography>
    );
  if (error)
    return <Typography sx={{ p: 2, color: "#dc2626" }}>{error}</Typography>;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2.5,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#1a1a2e" }}>
          Service Zones
        </Typography>
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddIcon fontSize="small" />}
          onClick={() => setAddingZone(true)}
          sx={{
            bgcolor: "#E8490F",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.82rem",
            borderRadius: 2,
            px: 2,
            py: 0.7,
            "&:hover": { bgcolor: "#c93d0c" },
          }}
        >
          Add Zone
        </Button>
      </Box>

      <ServiceZonesTable
        zones={data?.zones ?? []}
        onEdit={(zone) => setEditingZone(zone)}
      />

      <ServiceZonesConfig
        zoneConfig={zoneConfig}
        setZoneConfig={setZoneConfig}
        onSave={handleSaveConfig}
      />
    </Box>
  );
};

export default ServiceZones;
