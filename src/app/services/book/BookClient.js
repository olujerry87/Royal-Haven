"use client";

import Hero from "@/components/Hero";
import styles from "./page.module.css";
import { Mail, Phone, MapPin } from "lucide-react";

export default function BookClient({ page }) {
    // Fallback data
    const acf = page?.acf || {};
    const getVal = (key, fallback) => acf[key] || fallback;

    const data = {
        hero: {
            title: getVal('hero_title', 'Book an Appointment'),
            subtitle: getVal('hero_subtitle', 'Begin your journey with Ewa'),
            image: getVal('hero_image', '/images/spotlight.jpg')
        },
        intro: {
            title: getVal('intro_title', 'Get in Touch'),
            text: getVal('intro_text', 'Whether it’s for your big day, a creative project, or a personal makeover, we are here to bring your vision to life.')
        },
        contact: {
            email: getVal('contact_email', 'royalhaven.ng@gmail.com'),
            phone: getVal('contact_phone', '+1 (613) 286-0661'),
            address: getVal('contact_address', 'Ottawa, ON, Canada')
        },
        content: page?.content?.rendered || null
    };

    return (
        <main>
            <Hero
                title={data.hero.title}
                subtitle={data.hero.subtitle}
                imagePath={data.hero.image}
            />

            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Left: Contact Info */}
                    <div className={styles.infoSection}>
                        <h2 className={styles.sectionTitle}>{data.intro.title}</h2>
                        <p className={styles.lead} dangerouslySetInnerHTML={{ __html: data.intro.text }} />

                        <div className={styles.contactDetails}>
                            <div className={styles.contactItem}>
                                <div className={styles.iconWrapper}><Mail size={20} /></div>
                                <div>
                                    <h3>Email Us</h3>
                                    <p>{data.contact.email}</p>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.iconWrapper}><Phone size={20} /></div>
                                <div>
                                    <h3>Call Us</h3>
                                    <p>{data.contact.phone}</p>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.iconWrapper}><MapPin size={20} /></div>
                                <div>
                                    <h3>Base Operations</h3>
                                    <p>{data.contact.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Form / WP Placeholder */}
                    <div className={styles.formSection}>
                        {/* 
                            CALENDLY/WIDGET SUPPORT:
                            If the WordPress page has content (e.g. Calendly embed code), display it here.
                            Otherwise, fallback to the manual request form.
                        */}
                        {data.content ? (
                            <div className={styles.wpContent} dangerouslySetInnerHTML={{ __html: data.content }} />
                        ) : (
                            <div className={styles.wpPlaceholder}>
                                <div className={styles.widgetContainer}>
                                    <h2 className={styles.formTitle}>Schedule Your Appointment</h2>
                                    <p className={styles.widgetNote}>
                                        Please use the calendar below to book your session directly.
                                        If the calendar doesn&apos;t load, please refresh the page.
                                    </p>

                                    {/* Widget Placeholder - This is where the plugin/iframe will go */}
                                    <div className={styles.calendarWidget}>
                                        <div className={styles.loadingSpinner}>Loading Calendar...</div>
                                        {/* 
                                            INSTRUCTIONS: 
                                            1. Install your booking plugin (e.g., Calendly, Amelia) in WordPress.
                                            2. Paste the shortcode or embed code into the 'Book' page content in WP Admin.
                                            3. It will automatically render here via 'data.content'.
                                            
                                            If strictly using a client-side snippet (like Calendly inline widget), 
                                            you can paste the script here directly.
                                        */}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
