import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Divider, Typography } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AdminLayout from "../../components/layout/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { onboardRider } from "../../redux/sagas/riderManagement/onboardRiderAction";
import { resetOnboard } from "../../redux/slices/riderManagementSlice";
import { fetchZoneSettings } from "../../redux/sagas/serviceZones/zoneSettingsAction";
import type { RootState } from "../../redux/stores/store";
import {
  DEFAULT_CENTER,
  EMAIL_MAX,
  NAME_MAX,
  emptyForm,
  fileToBase64,
  validateDLNumber,
  validateEmail,
  validateField,
  validateName,
  validatePhone,
  validateRCNumber,
  validateVehicleNumber,
  vehicleTypes,
  type FormErrors,
  type FormShape,
  type Touched,
} from "./AddNewRiderHelpers";
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from "../../utils/googleMaps";
import AddNewRiderPersonalInfo from "./AddNewRiderPersonalInfo";
import AddNewRiderDetails from "./AddNewRiderDetails";
import AddNewRiderLocation from "./AddNewRiderLocation";

const AddNewRider: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const { onboardLoading, onboardSuccess, onboardError } = useSelector(
    (state: RootState) => state.riderManagement,
  );
  const { data: zoneData } = useSelector(
    (state: RootState) => state.zoneSettings,
  );
  const zones = zoneData?.zones ?? [];

  const [form, setForm] = useState<FormShape>({ ...emptyForm });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [vehicle, setVehicle] = useState("Bike");
  const [zoneId, setZoneId] = useState("");
  const [dlFile, setDlFile] = useState<File | null>(null);
  const [rcFile, setRcFile] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState<{ dl?: string; rc?: string }>({});
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [markerPos, setMarkerPos] = useState(DEFAULT_CENTER);
  const [addressOptions, setAddressOptions] = useState<string[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const placesRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    if (isLoaded && !placesRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
      placesRef.current = new google.maps.places.AutocompleteService();
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
    }
  }, [isLoaded]);

  const onMapLoad = useCallback(() => {
    if (!geocoderRef.current) geocoderRef.current = new google.maps.Geocoder();
    if (!placesRef.current)
      placesRef.current = new google.maps.places.AutocompleteService();
  }, []);

  const set =
    (key: keyof FormShape) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (key === "phone") value = value.replace(/\D/g, "").slice(0, 10);
      if (key === "name" && value.length > NAME_MAX) return;
      if (key === "email" && value.length > EMAIL_MAX) return;
      setForm((f) => ({ ...f, [key]: value }));
      if (touched[key]) {
        setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
      }
    };

  const handleBlur = (key: keyof FormShape) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, form[key]) }));
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {
      name: validateName(form.name),
      phone: validatePhone(form.phone),
      email: validateEmail(form.email),
      vehicleNumber: validateVehicleNumber(form.vehicleNumber),
      dlNumber: validateDLNumber(form.dlNumber),
      rcNumber: validateRCNumber(form.rcNumber),
    };
    const newFileErrors: { dl?: string; rc?: string } = {};
    if (!dlFile) newFileErrors.dl = "DL photo is required";
    if (!rcFile) newFileErrors.rc = "RC photo is required";
    setErrors(newErrors);
    setFileErrors(newFileErrors);
    setTouched({
      name: true,
      phone: true,
      email: true,
      vehicleNumber: true,
      dlNumber: true,
      rcNumber: true,
    });
    return (
      !Object.values(newErrors).some(Boolean) &&
      Object.keys(newFileErrors).length === 0
    );
  };

  const handleAddressInput = (value: string) => {
    setForm((f) => ({ ...f, currentAddress: value }));
    if (!value.trim()) {
      setAddressOptions([]);
      setAddressLoading(false);
      return;
    }
    if (!placesRef.current) {
      setAddressLoading(true);
      return;
    }
    setAddressLoading(true);
    placesRef.current.getPlacePredictions(
      {
        input: value,
        sessionToken: sessionTokenRef.current ?? undefined,
        componentRestrictions: { country: "in" },
        types: ["geocode"],
      },
      (predictions) => {
        setAddressOptions(predictions?.map((p) => p.description) ?? []);
        setAddressLoading(false);
      },
    );
  };

  const handleAddressSelect = (
    _: React.SyntheticEvent,
    value: string | null,
  ) => {
    if (!value) return;
    setForm((f) => ({ ...f, currentAddress: value }));
    geocoderRef.current?.geocode({ address: value }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const loc = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        setMapCenter(loc);
        setMarkerPos(loc);
      }
    });
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const loc = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(loc);
    geocoderRef.current?.geocode({ location: loc }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const addr = results[0].formatted_address;
        setForm((f) => ({ ...f, currentAddress: addr }));
      }
    });
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const loc = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(loc);
    geocoderRef.current?.geocode({ location: loc }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        setForm((f) => ({
          ...f,
          currentAddress: results[0].formatted_address,
        }));
      }
    });
  };

  useEffect(() => {
    dispatch(fetchZoneSettings());
  }, [dispatch]);

  useEffect(() => {
    if (onboardSuccess) {
      dispatch(resetOnboard());
      navigate("/riders");
    }
  }, [onboardSuccess, dispatch, navigate]);

  const handleSubmit = async () => {
    if (!validateAll()) return;

    const vType = vehicleTypes.find((v) => v.key === vehicle)?.apiKey ?? "bike";
    const dlPhotoUrl = dlFile ? await fileToBase64(dlFile) : "";
    const rcPhotoUrl = rcFile ? await fileToBase64(rcFile) : "";
    dispatch(
      onboardRider({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        vehicleType: vType,
        vehicleNumber: form.vehicleNumber.trim(),
        dlNumber: form.dlNumber.trim(),
        dlPhotoUrl,
        rcNumber: form.rcNumber.trim(),
        rcPhotoUrl,
        currentAddress: form.currentAddress.trim(),
        zoneId,
      }),
    );
  };

  return (
    <AdminLayout pageTitle="Add New Partner">
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2.5 }}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: "14px !important" }} />}
          onClick={() => navigate("/riders")}
          sx={{
            fontSize: "0.78rem",
            color: "#6b7280",
            textTransform: "none",
            minWidth: 0,
            p: 0,
            "&:hover": { bgcolor: "transparent", color: "#111827" },
          }}
        >
          Partner Management
        </Button>
        <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af" }}>/</Typography>
        <Typography sx={{ fontSize: "0.78rem", color: "#374151", fontWeight: 600 }}>
          Add New Partner
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: "1.35rem",
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.2,
          }}
        >
          Add New Partner
        </Typography>
        <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af", mt: 0.3 }}>
          Fields marked with * are required.
        </Typography>
      </Box>

      {onboardError && (
        <Alert severity="error" sx={{ mb: 2, fontSize: "0.82rem", borderRadius: 2 }}>
          {onboardError}
        </Alert>
      )}

      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 2.5,
          overflow: "hidden",
        }}
      >
        <AddNewRiderPersonalInfo
          form={form}
          errors={errors}
          touched={touched}
          onChange={set}
          onBlur={handleBlur}
        />

        <Divider sx={{ borderColor: "#f3f4f6" }} />

        <AddNewRiderDetails
          form={form}
          errors={errors}
          touched={touched}
          vehicle={vehicle}
          setVehicle={setVehicle}
          zoneId={zoneId}
          setZoneId={setZoneId}
          zones={zones}
          dlFile={dlFile}
          rcFile={rcFile}
          fileErrors={fileErrors}
          onDlFile={(f) => {
            setDlFile(f);
            setFileErrors((prev) => ({ ...prev, dl: undefined }));
          }}
          onRcFile={(f) => {
            setRcFile(f);
            setFileErrors((prev) => ({ ...prev, rc: undefined }));
          }}
          onChange={set}
          onBlur={handleBlur}
        />

        <Divider sx={{ borderColor: "#f3f4f6" }} />

        <AddNewRiderLocation
          isLoaded={isLoaded}
          currentAddress={form.currentAddress}
          addressOptions={addressOptions}
          addressLoading={addressLoading}
          mapCenter={mapCenter}
          markerPos={markerPos}
          onAddressInput={handleAddressInput}
          onAddressSelect={handleAddressSelect}
          onMapLoad={onMapLoad}
          onMapClick={handleMapClick}
          onMarkerDragEnd={handleMarkerDragEnd}
        />

        <Divider sx={{ borderColor: "#f3f4f6" }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 1.5,
            px: 3,
            py: 2,
            bgcolor: "#fafafa",
          }}
        >
          <Button
            size="small"
            onClick={() => navigate("/riders")}
            sx={{
              fontSize: "0.82rem",
              fontWeight: 600,
              textTransform: "none",
              color: "#374151",
              border: "1px solid #e5e7eb",
              borderRadius: 1.5,
              px: 2.5,
              py: 0.8,
              bgcolor: "#fff",
              "&:hover": { bgcolor: "#f9fafb" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon sx={{ fontSize: "15px !important" }} />}
            disabled={onboardLoading}
            onClick={handleSubmit}
            sx={{
              fontSize: "0.82rem",
              fontWeight: 700,
              textTransform: "none",
              bgcolor: "#E8490F",
              color: "#fff",
              borderRadius: 1.5,
              px: 2.5,
              py: 0.8,
              "&:hover": { bgcolor: "#c93d0c" },
              "&.Mui-disabled": {
                opacity: 0.65,
                color: "#fff",
                bgcolor: "#E8490F",
              },
            }}
          >
            {onboardLoading ? "Creating…" : "Create Partner Account"}
          </Button>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default AddNewRider;
