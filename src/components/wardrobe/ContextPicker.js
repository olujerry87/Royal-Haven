"use client";

import { useState } from "react";
import { MapPin, Briefcase, Coffee, Heart, Dumbbell, Sparkles } from "lucide-react";
import styles from "./ContextPicker.module.css";

const EVENTS = [
    { id: "work",   label: "Work",   icon: Briefcase, color: "#D4AF37" },
    { id: "casual", label: "Casual", icon: Coffee,    color: "#8E8E93" },
    { id: "date",   label: "Date",   icon: Heart,     color: "#FF3B30" },
    { id: "gym",    label: "Gym",    icon: Dumbbell,  color: "#30D158" },
];

export default function ContextPicker({ weather, onEventSelect, onCitySearch, loading }) {
    const [cityInput, setCityInput] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (cityInput.trim()) {
            onCitySearch(cityInput.trim());
            setCityInput("");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Sparkles size={24} className={styles.icon} />
                <h2>Where are we heading?</h2>
                <p>Tell the stylist your plans so we can match your closet to the mood.</p>
            </div>

            {/* Weather Confirmation */}
            <div className={styles.weatherCard}>
                <div className={styles.location}>
                    <MapPin size={16} />
                    <span>{weather?.cityName || "Current Location"}</span>
                </div>
                <div className={styles.temp}>
                    <span className={styles.degree}>{weather?.temp}°C</span>
                    <span className={styles.condition}>{weather?.emoji} {weather?.conditionLabel}</span>
                    {weather?.temp_max != null && weather?.temp_min != null && (
                        <span className={styles.highLow}>H:{weather.temp_max}° L:{weather.temp_min}°</span>
                    )}
                </div>
                
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input 
                        type="text" 
                        placeholder="Not there? Search city..." 
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "..." : "Search"}
                    </button>
                </form>
            </div>

            {/* Event Selection */}
            <div className={styles.eventGrid}>
                {EVENTS.map((event) => {
                    const Icon = event.icon;
                    return (
                        <button
                            key={event.id}
                            className={styles.eventCard}
                            onClick={() => onEventSelect(event.id)}
                            style={{ "--brand-color": event.color }}
                        >
                            <div className={styles.eventIcon}>
                                <Icon size={28} />
                            </div>
                            <span>{event.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
