/**
 * GET /api/wardrobe/weather?lat=...&lon=...
 * Server-side weather fetch using Open-Meteo (free, no API key).
 * Keeps all external API calls off the client.
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat") || "51.5074"; // Default: London
    const lon = searchParams.get("lon") || "-0.1278";

    try {
        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
            { next: { revalidate: 1800 } } // Cache for 30 mins
        );

        if (!res.ok) throw new Error("Open-Meteo fetch failed");
        const data = await res.json();

        const code = data.current_weather.weathercode;
        const temp = Math.round(data.current_weather.temperature);

        // Determine simplified condition
        let condition = "clear";
        if (code >= 51 && code <= 67) condition = "rain";
        else if (code >= 71 && code <= 77) condition = "snow";
        else if (code >= 80 && code <= 82) condition = "rain";
        else if (code >= 1 && code <= 3) condition = "cloudy";

        return Response.json({
            temp,
            condition, // "clear" | "rain" | "snow" | "cloudy"
            weathercode: code,
        });
    } catch (err) {
        console.error("[weather route]", err.message);
        return Response.json(
            { temp: 18, condition: "clear", weathercode: 0, fallback: true },
            { status: 200 } // Return fallback gracefully — don't crash the widget
        );
    }
}
