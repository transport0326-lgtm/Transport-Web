const VEHICLE_LABELS: Record<string, string> = {
  bike: "Bike",
  auto: "Auto",
  mini_truck: "Mini Truck",
  truck: "Truck",
};

export const capitalizeVehicle = (type: string | null | undefined): string => {
  if (!type) return "—";
  return VEHICLE_LABELS[type.toLowerCase()] ?? type;
};
