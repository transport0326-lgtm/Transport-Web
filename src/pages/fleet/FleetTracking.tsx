import React, { useState, useCallback, useEffect } from 'react';
import {
  Box, Typography, Button, Chip, Avatar,
  OutlinedInput, InputAdornment, Select, MenuItem, FormControl,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFleet } from '../../redux/sagas/fleetTracking/fleetAction';
import { fetchZoneSettings } from '../../redux/sagas/serviceZones/zoneSettingsAction';
import type { RootState } from '../../redux/stores/store';
import type{ Rider } from '../../redux/slices/fleetTrackingSlice';
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from '../../utils/googleMaps';

type FilterType = 'All Partners' | 'Active' | 'Idle' | 'Offline';

// API status → display label
const statusLabel = (status: string): string => {
  if (status === 'onDelivery') return 'On Delivery';
  if (status === 'idle')       return 'Idle';
  return 'Offline';
};

const statusStyle: Record<string, { bgcolor: string; color: string }> = {
  onDelivery: { bgcolor: '#e8f5e9', color: '#2e7d32' },
  idle:       { bgcolor: '#fff8e1', color: '#e65100' },
  offline:    { bgcolor: '#fdecea', color: '#c62828' },
};

const markerColor: Record<string, string> = {
  onDelivery: '#43a047',
  idle:       '#ffa726',
  offline:    '#ef5350',
};

const filters: FilterType[] = ['All Partners', 'Active', 'Idle', 'Offline'];

const MAP_CENTER = { lat: 22.5558, lng: 88.3471 };
const mapContainerStyle = { width: '100%', height: '520px' };

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    { featureType: 'poi',     stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
  ],
};

const makeMarkerIcon = (status: string, label: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14" fill="${markerColor[status] ?? '#999'}" stroke="white" stroke-width="2.5"/>
      <text x="18" y="22" text-anchor="middle" fill="white" font-size="10" font-weight="bold" font-family="Arial,sans-serif">${label}</text>
    </svg>`
  )}`;

const FleetTracking: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.fleet);
  const { data: zoneData } = useSelector((state: RootState) => state.zoneSettings);

  const [activeFilter, setActiveFilter] = useState<FilterType>('All Partners');
  const [zoneFilter, setZoneFilter]     = useState('');
  const [search, setSearch]             = useState('');
  const [selected, setSelected]         = useState<string | null>(null);
  const [mapRef, setMapRef]             = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  useEffect(() => { dispatch(fetchZoneSettings()); }, [dispatch]);

  // ── Fetch on filter / search change ──────────────────────
  useEffect(() => {
    const filterMap: Record<FilterType, 'active' | 'idle' | 'offline' | undefined> = {
      'All Partners': undefined,
      'Active':     'active',
      'Idle':       'idle',
      'Offline':    'offline',
    };
    dispatch(fetchFleet({
      filter: filterMap[activeFilter],
      search: search.trim() || undefined,
    }));
  }, [activeFilter, search, dispatch]);

  // ── Pan map when zone changes; default to current location ──
  useEffect(() => {
    if (!mapRef || !isLoaded) return;

    if (!zoneFilter) {
      navigator.geolocation?.getCurrentPosition(
        (pos) => mapRef.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      );
      return;
    }

    const zone = zoneData?.zones.find((z) => z._id === zoneFilter);
    if (!zone) return;

    new window.google.maps.Geocoder().geocode(
      { address: `${zone.city}, ${zone.state}, ${zone.country}` },
      (results, status) => {
        if (status === 'OK' && results?.[0]) {
          mapRef.panTo(results[0].geometry.location);
          mapRef.setZoom(12);
        }
      },
    );
  }, [zoneFilter, mapRef, zoneData, isLoaded]);

  // ── Riders from Redux ─────────────────────────────────────
  const allRiders: Rider[] = data?.riders ?? [];

  // Client-side filter (API bhi filter karta hai, but UI sync ke liye)
  const visibleRiders = allRiders.filter((r) => {
    const matchSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicleNumber.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      activeFilter === 'All Partners' ||
      (activeFilter === 'Active'  && r.status === 'onDelivery') ||
      (activeFilter === 'Idle'    && r.status === 'idle') ||
      (activeFilter === 'Offline' && r.status === 'offline');

    const matchZone = !zoneFilter || r.zoneId === zoneFilter;

    return matchSearch && matchFilter && matchZone;
  });

  // Map mein sirf wo riders jinke paas location hai
  const mapRiders = visibleRiders.filter(
    (r) => r.location !== null
  );

  const handleRiderSelect = (id: string | null) => {
    setSelected(id);
    if (id && mapRef) {
      const rider = allRiders.find((r) => r._id === id);
      if (rider?.location) {
        mapRef.panTo({
          lat: (rider.location as any).lat,
          lng: (rider.location as any).lng,
        });
      }
    }
  };

  const selectedRider = allRiders.find((r) => r._id === selected) ?? null;

  // ── Summary stats ─────────────────────────────────────────
  const summary = data?.summary;

  return (
    <AdminLayout pageTitle="Fleet Tracking">

      {/* Summary pills */}
      {summary && (
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
          {[
            { label: 'Total',       value: summary.total,      color: '#0D1B3E' },
            { label: 'On Delivery', value: summary.onDelivery, color: '#2e7d32' },
            { label: 'Idle',        value: summary.idle,       color: '#e65100' },
            { label: 'Offline',     value: summary.offline,    color: '#c62828' },
          ].map((s) => (
            <Box
              key={s.label}
              sx={{
                px: 2, py: 0.6, borderRadius: 2,
                border: '1px solid #eee', bgcolor: '#fafafa',
                display: 'flex', alignItems: 'center', gap: 0.8,
              }}
            >
              <Typography sx={{ fontSize: '0.78rem', color: '#888' }}>{s.label}</Typography>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: s.color }}>
                {s.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Filter bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {filters.map((f) => {
          const isActive = activeFilter === f;
          return (
            <Button
              key={f}
              onClick={() => setActiveFilter(f)}
              disableElevation
              variant={isActive ? 'contained' : 'outlined'}
              sx={{
                textTransform: 'none', fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 500, borderRadius: 2,
                px: 2, py: 0.6,
                bgcolor: isActive ? '#0D1B3E' : '#fff',
                color: isActive ? '#fff' : '#555',
                borderColor: '#ddd',
                '&:hover': { bgcolor: isActive ? '#162b5e' : '#f5f5f5', borderColor: '#bbb' },
              }}
            >
              {f}
            </Button>
          );
        })}

        {/* Zone dropdown — right side */}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Typography sx={{ fontSize: '0.8rem', color: '#73737a', fontWeight: 500, whiteSpace: 'nowrap' }}>
            Zone:
          </Typography>
          <FormControl size="small">
            <Select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              displayEmpty
              sx={{
                fontSize: '0.82rem', borderRadius: 2, height: 36, minWidth: 180,
                bgcolor: '#fff',
                '& fieldset': { borderColor: '#e0e0e5', borderWidth: '1.5px' },
                '& .MuiSelect-select': { py: 0.8, display: 'flex', alignItems: 'center', gap: 0.5 },
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              }}
              renderValue={(val) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <span>📍</span>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 500, color: '#1a1a1f' }}>
                    {val ? (zoneData?.zones.find((z) => z._id === val)?.name ?? 'Zone') : 'All Zones'}
                  </Typography>
                </Box>
              )}
            >
              <MenuItem value="" sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#001a48' }}>
                📍&nbsp; All Zones
              </MenuItem>
              {(zoneData?.zones ?? []).map((z) => (
                <MenuItem key={z._id} value={z._id} sx={{ fontSize: '0.82rem', color: '#1a1a1f' }}>
                  🏙️&nbsp; {z.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Loading / Error */}
      {loading && (
        <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af', mb: 1.5 }}>
          Loading fleet data...
        </Typography>
      )}
      {error && (
        <Typography sx={{ fontSize: '0.82rem', color: '#dc2626', mb: 1.5 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>

        {/* Map Panel */}
        <Box sx={{ flex: 1, borderRadius: 2, border: '1px solid #e0e0e0', overflow: 'hidden', minHeight: 520 }}>
          {loadError ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 520, bgcolor: '#f5f5f5' }}>
              <Typography sx={{ color: '#c62828', fontSize: '0.85rem' }}>
                Failed to load Google Maps. Check your API key.
              </Typography>
            </Box>
          ) : !isLoaded ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 520, bgcolor: '#f5f5f5' }}>
              <Typography sx={{ color: '#aaa', fontSize: '0.85rem' }}>Loading map…</Typography>
            </Box>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={MAP_CENTER}
              zoom={12}
              options={mapOptions}
              onLoad={onMapLoad}
            >
              {mapRiders.map((rider) => (
                <Marker
                  key={rider._id}
                  position={{
                    lat: (rider.location as any).lat,
                    lng: (rider.location as any).lng,
                  }}
                  icon={{
                    url: makeMarkerIcon(rider.status, rider.initials),
                    scaledSize: new window.google.maps.Size(36, 36),
                    anchor: new window.google.maps.Point(18, 18),
                  }}
                  onClick={() => handleRiderSelect(selected === rider._id ? null : rider._id)}
                  zIndex={selected === rider._id ? 10 : 5}
                />
              ))}

              {selectedRider && selectedRider.location && (
                <InfoWindow
                  position={{
                    lat: (selectedRider.location as any).lat,
                    lng: (selectedRider.location as any).lng,
                  }}
                  onCloseClick={() => setSelected(null)}
                  options={{ pixelOffset: new window.google.maps.Size(0, -20) }}
                >
                  <Box sx={{ minWidth: 140 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a1a2e', mb: 0.3 }}>
                      {selectedRider.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>
                      {selectedRider.vehicleNumber}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#888', mt: 0.2 }}>
                      {selectedRider.vehicleType ?? '—'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: markerColor[selectedRider.status] }} />
                      <Typography sx={{ fontSize: '0.72rem', color: markerColor[selectedRider.status], fontWeight: 600 }}>
                        {statusLabel(selectedRider.status)}
                      </Typography>
                    </Box>
                  </Box>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </Box>

        {/* Right — Rider list */}
        <Box sx={{ width: 280, flexShrink: 0, bgcolor: '#fff', border: '1px solid #eee', borderRadius: 2, overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ px: 2.5, pt: 2, pb: 1.5, borderBottom: '1px solid #f0f0f0' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', mb: 1.2 }}>
              Partners ({visibleRiders.length})
            </Typography>
            <OutlinedInput
              fullWidth
              size="small"
              placeholder="Search partners…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: '#bbb' }} />
                </InputAdornment>
              }
              sx={{
                fontSize: '0.8rem', borderRadius: 2,
                '& fieldset': { borderColor: '#e0e0e0' },
                '& input': { py: 0.6 },
              }}
            />
          </Box>

          {/* Rider rows */}
          <Box sx={{ overflowY: 'auto', maxHeight: 460 }}>
            {visibleRiders.length === 0 && !loading && (
              <Typography sx={{ p: 2, fontSize: '0.82rem', color: '#9ca3af', textAlign: 'center' }}>
                No partners found
              </Typography>
            )}
            {visibleRiders.map((rider) => {
              const isSelected = selected === rider._id;
              return (
                <Box
                  key={rider._id}
                  onClick={() => handleRiderSelect(isSelected ? null : rider._id)}
                  sx={{
                    px: 2.5, py: 1.4,
                    display: 'flex', alignItems: 'center', gap: 1.2,
                    cursor: 'pointer',
                    bgcolor: isSelected ? '#f5f5ff' : 'transparent',
                    borderBottom: '1px solid #f5f5f5',
                    '&:hover': { bgcolor: '#fafafa' },
                    '&:last-child': { borderBottom: 0 },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32, height: 32,
                      bgcolor: markerColor[rider.status] ?? '#999',
                      fontSize: '0.68rem', fontWeight: 700, flexShrink: 0,
                    }}
                  >
                    {rider.initials}
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.83rem', color: '#1a1a2e', lineHeight: 1.2 }}>
                      {rider.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#aaa', mt: 0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {rider.vehicleNumber}
                      {rider.vehicleType ? ` · ${rider.vehicleType}` : ''}
                    </Typography>
                  </Box>

                  <Chip
                    label={statusLabel(rider.status)}
                    size="small"
                    sx={{
                      fontSize: '0.65rem', fontWeight: 700, height: 20, borderRadius: 1,
                      bgcolor: statusStyle[rider.status]?.bgcolor ?? '#f5f5f5',
                      color:   statusStyle[rider.status]?.color   ?? '#555',
                      flexShrink: 0,
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>

      </Box>
    </AdminLayout>
  );
};

export default FleetTracking;