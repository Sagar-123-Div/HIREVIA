function formatAmount(amount) {
  const value = Number(amount);
  return Number.isFinite(value) ? `₹${value.toLocaleString("en-IN")}` : "";
}

export function formatSalary(salary) {
  if (salary == null || salary === "") return "Salary not specified";

  if (typeof salary === "number") {
    return formatAmount(salary);
  }

  if (typeof salary === "object") {
    const minimum = salary.min ?? salary.minimum;
    const maximum = salary.max ?? salary.maximum;

    if (minimum != null && maximum != null) {
      return `${formatAmount(minimum)} - ${formatAmount(maximum)}`;
    }
    if (minimum != null || maximum != null) {
      return formatAmount(minimum ?? maximum) || "Salary not specified";
    }
    return "Salary not specified";
  }

  const value = String(salary).trim().replace(/\bUSD\s*/gi, "₹").replace(/\$/g, "₹");
  if (!value) return "Salary not specified";

  if (!value.includes("₹") && /^\d/.test(value)) {
    return `₹${value}`;
  }

  return value;
}
