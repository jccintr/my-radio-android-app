export interface RadioCity {
  id: number;
  name: string;
  state: string;
}

export interface RadioCategory {
  id: number;
  name: string;
}

export interface Radio {
  id: number;
  name: string;
  shortName: string;
  streamUrl: string;
  imageUrl: string;
  hsl: boolean; // indica stream no formato HLS (m3u8)
  city: RadioCity;
  categories: RadioCategory[];
}

const RADIOS_ENDPOINT = "https://radios-api-production.up.railway.app/radios/all";

export async function fetchRadios(): Promise<Radio[]> {
  const response = await fetch(RADIOS_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Falha ao buscar rádios (status ${response.status})`);
  }

  const data = (await response.json()) as Radio[];

  // Ordena alfabeticamente pelo nome para uma listagem previsível.
  return [...data].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}
