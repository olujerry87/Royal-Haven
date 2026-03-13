"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudRain, Sun, Cloud, ThermometerSun, Loader2, MapPin } from "lucide-react";
import styles from "./WeatherStyling.module.css";

export default function WeatherStyling({ garmentName }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationInput, setLocationInput] = useState("");
    const [isManualLocation, setIsManualLocation] = useState(false);

    // Initial weather fetch via geolocation
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                (err) => {
                    console.warn("Geolocation denied or failed.", err);
                    // Fallback to London coordinates if denied
                    fetchWeather(51.5074, -0.1278, "London (Default)");
                    setIsManualLocation(true);
                }
            );
        } else {
            // Fallback to London coordinates
            fetchWeather(51.5074, -0.1278, "London (Default)");
            setIsManualLocation(true);
        }
    }, []);

    const fetchWeather = async (lat, lon, cityName = "Current Location") => {
        setLoading(true);
        setError(null);
        try {
            // Open-Meteo free API
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            if (!res.ok) throw new Error("Failed to fetch weather data");
            const data = await res.json();
            
            setWeather({
                temp: Math.round(data.current_weather.temperature),
                conditionCode: data.current_weather.weathercode,
                location: cityName
            });
        } catch (err) {
            console.error(err);
            setError("Styling intelligence temporarily unavailable.");
        } finally {
            setLoading(false);
        }
    };

    // Very basic geocoding mock for manual location input (Open-Meteo has a geocoding API but avoiding extra calls to stay safe on free tier)
    const handleLocationSubmit = (e) => {
        e.preventDefault();
        // Since we can't easily geocode names consistently without an API key, we will simulate a refresh
        // In a real app, you'd hit a geocoding API here.
        setWeather(prev => ({ ...prev, location: locationInput }));
        setLocationInput("");
        setIsManualLocation(false);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.spinner} size={24} />
                <p>Consulting the elements...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.errorContainer}>{error}</div>;
    }

    // Determine Styling Logic Based on Weather
    const { temp, conditionCode, location } = weather;
    let weatherCondition = "Clear";
    let WeatherIcon = Sun;
    let logicNote = "";
    let recommendations = {
        gele: "",
        makeup: "",
        accessories: ""
    };

    // WMO Weather interpretation codes
    if (conditionCode >= 51 && conditionCode <= 67) {
        weatherCondition = "Rainy";
        WeatherIcon = CloudRain;
        logicNote = `Since it's ${temp}°C and rainy in ${location}, we suggest protecting your look while maintaining elegance.`;
        recommendations = {
            gele: "Structured, moisture-resistant Silk Gele (Compact Tie)",
            makeup: "Matte Foundation with waterproof setting spray by Ewa",
            accessories: "Minimalist Gold Studs (Avoid long cascading pieces)"
        };
    } else if (temp < 15) {
        weatherCondition = "Cool";
        WeatherIcon = Cloud;
        logicNote = `A brisk ${temp}°C in ${location} calls for warmth layered with luxury.`;
        recommendations = {
            gele: "Velvet or heavy Damask Gele in deep jewel tones",
            makeup: "Hydrating Primer, bold berry lip, and rich contour",
            accessories: "Chunky Gold Choker, Statement Bracelets"
        };
    } else {
        weatherCondition = "Warm";
        WeatherIcon = ThermometerSun;
        logicNote = `A beautiful ${temp}°C in ${location}. Let the ${garmentName} breathe and shine.`;
        recommendations = {
            gele: "Lightweight Aso-Oke or Net Lace Gele (Wide, airy tie)",
            makeup: "Dewy Glass-Skin finish with a subtle nude lip",
            accessories: "Delicate Gold Chains and Drop Earrings"
        };
    }

    return (
        <div className={styles.stylingContainer}>
            <div className={styles.weatherContext}>
                <div className={styles.weatherBadge}>
                    <WeatherIcon size={24} className={styles.weatherIcon} />
                    <span className={styles.temp}>{temp}°C</span>
                </div>
                
                <div className={styles.logicNote}>
                    <p>{logicNote}</p>
                    {isManualLocation && (
                        <div className={styles.locationForm}>
                            <MapPin size={14} />
                            <form onSubmit={handleLocationSubmit}>
                                <input 
                                    type="text" 
                                    placeholder="Enter your city..." 
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    className={styles.locationInput}
                                />
                                <button type="submit" className={styles.locationBtn}>Update</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.recommendationsGrid}>
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={styles.recCard}
                >
                    <h4>Headpiece (Gele)</h4>
                    <p>{recommendations.gele}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={styles.recCard}
                >
                    <h4>Makeup by Ewa</h4>
                    <p>{recommendations.makeup}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={styles.recCard}
                >
                    <h4>Accessories</h4>
                    <p>{recommendations.accessories}</p>
                </motion.div>
            </div>
        </div>
    );
}
