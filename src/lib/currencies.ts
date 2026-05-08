export interface CurrencyOption {
  code: string;
  label: string;
  symbol: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", label: "Dólar estadounidense", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "VES", label: "Bolívar venezolano", symbol: "Bs" },
  { code: "COP", label: "Peso colombiano", symbol: "$" },
  { code: "MXN", label: "Peso mexicano", symbol: "$" },
  { code: "ARS", label: "Peso argentino", symbol: "$" },
  { code: "CLP", label: "Peso chileno", symbol: "$" },
  { code: "PEN", label: "Sol peruano", symbol: "S/" },
  { code: "BRL", label: "Real brasileño", symbol: "R$" },
  { code: "UYU", label: "Peso uruguayo", symbol: "$U" },
  { code: "BOB", label: "Boliviano", symbol: "Bs" },
  { code: "PYG", label: "Guaraní paraguayo", symbol: "₲" },
  { code: "DOP", label: "Peso dominicano", symbol: "RD$" },
  { code: "GTQ", label: "Quetzal guatemalteco", symbol: "Q" },
  { code: "HNL", label: "Lempira hondureño", symbol: "L" },
  { code: "NIO", label: "Córdoba nicaragüense", symbol: "C$" },
  { code: "CRC", label: "Colón costarricense", symbol: "₡" },
  { code: "PAB", label: "Balboa panameño", symbol: "B/." },
];

export const COUNTRIES = [
  { code: "VE", label: "Venezuela" },
  { code: "CO", label: "Colombia" },
  { code: "MX", label: "México" },
  { code: "AR", label: "Argentina" },
  { code: "CL", label: "Chile" },
  { code: "PE", label: "Perú" },
  { code: "EC", label: "Ecuador" },
  { code: "BR", label: "Brasil" },
  { code: "US", label: "Estados Unidos" },
  { code: "ES", label: "España" },
  { code: "UY", label: "Uruguay" },
  { code: "BO", label: "Bolivia" },
  { code: "PY", label: "Paraguay" },
  { code: "DO", label: "República Dominicana" },
  { code: "GT", label: "Guatemala" },
  { code: "HN", label: "Honduras" },
  { code: "NI", label: "Nicaragua" },
  { code: "CR", label: "Costa Rica" },
  { code: "PA", label: "Panamá" },
];
