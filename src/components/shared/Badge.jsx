import { STATUS_COLORS } from "../../constants";

export function Badge({ status }) {
  const color = STATUS_COLORS[status] || "#aaa";
  return (
    <span style={{
      padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 800,
      color, background: `${color}20`, border: `1px solid ${color}40`,
    }}>
      {status}
    </span>
  );
}
