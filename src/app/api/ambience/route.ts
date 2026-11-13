import { getWeather } from "@/lib/ambience/weather";

export async function GET() {
  const weather = await getWeather();
  return Response.json({ weather });
}
