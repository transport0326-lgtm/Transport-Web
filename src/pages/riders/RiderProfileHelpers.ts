export const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export interface DocItem {
  key: string;
  type: string;
  required: boolean;
  status: string;
  number: string;
  submitted: string;
  url: string | null;
}
