/**
 * GET /api/wardrobe/weather?lat=...&lon=...&city=...
 * Server-side weather fetch using Open-Meteo (free, no API key).
 * If `city` is provided instead of lat/lon, geocodes it first via Open-Meteo Geocoding API.
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    let lat = searchParams.get("lat");
    let lon = searchParams.get("lon");
    let cityName = searchParams.get("city") || null;

    // If city name provided, geocode it first
    if (cityName && (!lat || !lon)) {
        try {
            const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
            );
            const geoData = await geoRes.json();
            if (geoData.results?.[0]) {
                lat = geoData.results[0].latitude;
                lon = geoData.results[0].longitude;
                cityName = geoData.results[0].name + ", " + (geoData.results[0].country || "");
            }
        } catch { /* fall through to defaults */ }
    }

    lat = lat || "51.5074";
    lon = lon || "-0.1278";
    if (!cityName) cityName = "Your Location";

    try {
        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`,
            { next: { revalidate: 1800 } }
        );
        if (!res.ok) throw new Error("Open-Meteo fetch failed");
        const data = await res.json();

        const code = data.current.weather_code;
        const temp = Math.round(data.current.temperature_2m);
        const feels_like = Math.round(data.current.apparent_temperature);
        const windspeed = Math.round(data.current.wind_speed_10m);
        const humidity = data.current.relative_humidity_2m ?? null;
        const temp_max = data.daily?.temperature_2m_max?.[0] ? Math.round(data.daily.temperature_2m_max[0]) : null;
        const temp_min = data.daily?.temperature_2m_min?.[0] ? Math.round(data.daily.temperature_2m_min[0]) : null;

        // WMO code → simplified condition + label
        let condition = "clear";
        let conditionLabel = "Clear Skies";
        let emoji = "☀️";

        if (code === 0) { condition = "clear"; conditionLabel = "Clear Skies"; emoji = "☀️"; }
        else if (code <= 3) { condition = "cloudy"; conditionLabel = "Partly Cloudy"; emoji = "⛅"; }
        else if (code <= 48) { condition = "cloudy"; conditionLabel = "Overcast / Foggy"; emoji = "🌫️"; }
        else if (code <= 67) { condition = "rain"; conditionLabel = "Rainy"; emoji = "🌧️"; }
        else if (code <= 77) { condition = "snow"; conditionLabel = "Snowy"; emoji = "❄️"; }
        else if (code <= 82) { condition = "rain"; conditionLabel = "Heavy Showers"; emoji = "⛈️"; }
        else { condition = "rain"; conditionLabel = "Stormy"; emoji = "🌩️"; }

        return Response.json({
            temp,
            feels_like,
            temp_max,
            temp_min,
            condition,
            conditionLabel,
            emoji,
            humidity,
            windspeed,
            cityName,
            weathercode: code,
        });
    } catch (err) {
        console.error("[weather route]", err.message);
        return Response.json(
            { temp: 18, feels_like: 18, temp_max: 22, temp_min: 14, condition: "clear", conditionLabel: "Clear Skies", emoji: "☀️", humidity: 50, windspeed: 10, cityName: "Unknown", weathercode: 0, fallback: true },
            { status: 200 }
        );
    }
}
