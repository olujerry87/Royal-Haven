"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IdentityPicker from "./IdentityPicker";
import VibeCheck from "./VibeCheck";
import ClosetBuilder from "./ClosetBuilder";
import ColorPicker from "./ColorPicker";
import ContextPicker from "./ContextPicker";
import OutfitResult from "./OutfitResult";
import NudgeCard from "./NudgeCard";
import styles from "./WardrobeWidget.module.css";

// Generate or retrieve anonymous wardrobe UUID with fallback
function getWardrobeId() {
    if (typeof window === "undefined") return null;
    let id = localStorage.getItem("wardrobe_id");
    if (!id) {
        try {
            id = crypto.randomUUID();
        } catch (e) {
            // Fallback for older browsers
            id = 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        localStorage.setItem("wardrobe_id", id);
    }
    return id;
}

const SCREENS = ["identity", "vibe", "closet", "colors", "context", "outfit"];

export default function WardrobeWidget() {
    const [screen, setScreen] = useState("identity"); 
    const [wardrobeId, setWardrobeId] = useState(null);
    const [gender, setGender] = useState(null); 
    const [vibe, setVibe] = useState(null);
    const [weather, setWeather] = useState(null);
    const [event, setEvent] = useState("casual");
    const [items, setItems] = useState([]);
    const [closetIds, setClosetIds] = useState(new Set());
    const [itemColors, setItemColors] = useState({});
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recLoading, setRecLoading] = useState(false);
    const [cityInput, setCityInput] = useState("");
    const [cityLoading, setCityLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Init wardrobe ID + fetch weather on mount
    useEffect(() => {
        console.log("Royal Haven Styling - v2.1 (Gender/Color Pro)");
        const id = getWardrobeId();
        setWardrobeId(id);

        const storedIdent = localStorage.getItem("wardrobe_gender");
        const storedVibe = localStorage.getItem("wardrobe_vibe");

        if (storedIdent && storedVibe) {
            setGender(storedIdent);
            setVibe(storedVibe);
            setScreen("context");
        } else if (storedIdent) {
            setGender(storedIdent);
            setScreen("vibe");
        }

        // Fetch weather (via server route, using geolocation if available)
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
                () => fetchWeather(51.5074, -0.1278) // London fallback
            );
        } else {
            fetchWeather(51.5074, -0.1278);
        }
        setMounted(true);
    }, []);

    if (!mounted) return <div className={styles.loadingWidget}>Loading Digital Closet...</div>;

    const fetchWeather = async (lat, lon, city = null) => {
        try {
            const params = city
                ? `city=${encodeURIComponent(city)}`
                : `lat=${lat}&lon=${lon}`;
            const res = await fetch(`/api/wardrobe/weather?${params}`);
            const data = await res.json();
            setWeather(data);
            return data;
        } catch {
            const fallback = { temp: 18, condition: "clear", conditionLabel: "Clear Skies", emoji: "☀️", cityName: "Unknown" };
            setWeather(fallback);
            return fallback;
        }
    };

    const handleCitySearch = async (e) => {
        e.preventDefault();
        if (!cityInput.trim()) return;
        setCityLoading(true);
        const newWeather = await fetchWeather(null, null, cityInput.trim());
        setCityInput("");
        setCityLoading(false);
        // Re-fetch recommendation with new weather
        if (screen === "outfit" && wardrobeId) {
            fetchRecommendation(event, newWeather);
        }
    };

    const handleIdentitySelect = (selectedGender) => {
        setGender(selectedGender);
        localStorage.setItem("wardrobe_gender", selectedGender);
        setScreen("vibe");
        
        // Fetch items now that we have gender focus
        const storedId = localStorage.getItem("wardrobe_id") || getWardrobeId();
        setWardrobeId(storedId);
        fetchItems(storedId, selectedGender);
    };

    // Updated fetchItems to handle gender filtering locally or via API
    const fetchItems = async (id, filterGender) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/wardrobe/init?wardrobe_id=${id}`);
            const data = await res.json();
            
            console.log(`[Wardrobe] Fetched ${data.templates?.length} items. Filtering for: ${filterGender}`);
            
            // Filter templates based on gender focus (using weather_tags array proxy)
            const filtered = data.templates?.filter(item => {
                const tags = item.weather_tags || [];
                const match = tags.includes('unisex') || tags.includes(filterGender);
                return match;
            }) || [];
            
            console.log(`[Wardrobe] Done. Showing ${filtered.length} items.`);
            setItems(filtered);
            setClosetIds(new Set(data.closetIds || []));
        } catch (err) {
            console.error("Init failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetVibe = () => {
        localStorage.removeItem("wardrobe_vibe");
        setVibe(null);
        setRecommendation(null);
        setScreen("vibe");
    };

    const handleStartOver = () => {
        localStorage.removeItem("wardrobe_gender");
        localStorage.removeItem("wardrobe_vibe");
        localStorage.removeItem("wardrobe_id"); // Force unique ID if starting fresh
        setGender(null);
        setVibe(null);
        setWardrobeId(null);
        setRecommendation(null);
        setItems([]);
        setClosetIds(new Set());
        setItemColors({});
        setScreen("identity");
        
        // Regenerate ID immediately
        const newId = getWardrobeId();
        setWardrobeId(newId);
    };

    const handleVibeSelect = (v) => {
        setVibe(v);
        localStorage.setItem("wardrobe_vibe", v);
        setScreen("closet");
    };

    // Toggle item in closet
    const handleToggle = async (templateId, currentlyOwned) => {
        const action = currentlyOwned ? "remove" : "add";
        setClosetIds((prev) => {
            const next = new Set(prev);
            action === "add" ? next.add(templateId) : next.delete(templateId);
            return next;
        });
        await fetch("/api/wardrobe/closet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wardrobe_id: wardrobeId, template_id: templateId, action }),
        });
    };

    // Step 2: Done with closet → go to color picker
    const handleClosetDone = () => {
        setScreen("colors");
    };

    // Step 3: Color picker done → go to context
    const handleColorsDone = () => {
        setScreen("context");
    };

    const handleColorChange = (itemId, colorId) => {
        setItemColors(prev => ({ ...prev, [itemId]: colorId }));
    };

    // Step 3: Context selected → get recommendation
    const handleContextComplete = (selectedEvent) => {
        setEvent(selectedEvent);
        setScreen("outfit");
        fetchRecommendation(selectedEvent);
    };

    // Fetch recommendation (re-runs when event changes too)
    const fetchRecommendation = async (overrideEvent = event, overrideWeather = weather) => {
        if (!overrideWeather || !wardrobeId) return;
        setRecLoading(true);
        try {
            const res = await fetch("/api/wardrobe/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    wardrobe_id: wardrobeId, 
                    weather: overrideWeather, 
                    event: overrideEvent,
                    gender, // Pass gender focus
                    vibe: vibe,
                    itemColors
                }),
            });
            const data = await res.json();
            setRecommendation(data);
        } catch (err) {
            console.error(err);
        } finally {
            setRecLoading(false);
        }
    };

    const handleEventChange = (newEvent) => {
        setEvent(newEvent);
        fetchRecommendation(newEvent);
    };

    return (
        <div className={styles.widget}>
            {/* Step indicator */}
            <div className={styles.steps}>
                {SCREENS.map((s, i) => (
                    <span
                        key={s}
                        className={`${styles.step} ${screen === s ? styles.activeStep : ""} ${SCREENS.indexOf(screen) > i ? styles.doneStep : ""}`}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {screen === "identity" && (
                    <motion.div key="identity" {...slide}>
                        <IdentityPicker onSelect={handleIdentitySelect} />
                    </motion.div>
                )}

                {screen === "vibe" && (
                    <motion.div key="vibe" {...slide}>
                        <VibeCheck onSelect={handleVibeSelect} />
                    </motion.div>
                )}

                {screen === "closet" && (
                    <motion.div key="closet" {...slide}>
                        <ClosetBuilder
                            items={items}
                            closetIds={closetIds}
                            onToggle={handleToggle}
                            onDone={handleClosetDone}
                            loading={loading}
                        />
                    </motion.div>
                )}

                {screen === "colors" && (
                    <motion.div key="colors" {...slide}>
                        <ColorPicker
                            items={items}
                            closetIds={closetIds}
                            itemColors={itemColors}
                            onChange={handleColorChange}
                            onDone={handleColorsDone}
                        />
                    </motion.div>
                )}

                {screen === "context" && (
                    <motion.div key="context" {...slide}>
                        <ContextPicker 
                            weather={weather}
                            onEventSelect={handleContextComplete}
                            onCitySearch={(city) => fetchWeather(null, null, city)}
                            loading={cityLoading}
                        />
                    </motion.div>
                )}

                {screen === "outfit" && (
                    <motion.div key="outfit" {...slide}>
                        <OutfitResult
                            weather={weather}
                            event={event}
                            onEventChange={handleEventChange}
                            items={recommendation?.matchedItems || []}
                            reasoning={recommendation?.reasoning || null}
                            formulaName={recommendation?.formulaName || null}
                            stylistAdvice={recommendation?.stylistAdvice || null}
                            matchRate={recommendation?.matchRate || 0}
                            stylingTips={recommendation?.stylingTips || []}
                            colorPalette={recommendation?.colorPalette || null}
                            loading={recLoading}
                            onResetVibe={handleResetVibe}
                            onStartOver={handleStartOver}
                        />
                        {recommendation?.missingCategory && (
                            <NudgeCard
                                missingCategory={recommendation.missingCategory}
                                product={recommendation.nudgeProduct}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const slide = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.35 },
};
