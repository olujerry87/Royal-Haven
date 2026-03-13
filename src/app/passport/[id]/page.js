import { supabase } from "@/lib/supabaseClient";
import OwnershipActivation from "@/components/passport/OwnershipActivation";
import PassportDetails from "@/components/passport/PassportDetails";
import styles from "./page.module.css";

// This is a dynamic route that takes `params.id` from the URL
export default async function PassportPage({ params }) {
    // 1. Await params before accessing them (Next.js 15+ requirement)
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // 2. Fetch the garment using the ID from Supabase
    let garment = null;
    let error = null;

    if (supabase) {
        const { data, error: fetchError } = await supabase
            .from("garments")
            .select("*")
            .eq("id", id)
            .single();

        garment = data;
        error = fetchError;
    }

    if (!supabase) {
        // Fallback for when Supabase keys are not set yet
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2>Setup Required</h2>
                    <p>Please configure your Supabase environment variables to view this passport.</p>
                </div>
            </div>
        );
    }

    if (error && error.code === "PGRST116") {
        // PostgREST error for "0 rows returned"
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2>Garment Not Found</h2>
                    <p>We couldn't find a garment with the ID: {id}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2>Error loading garment</h2>
                    <p>{error.message}</p>
                </div>
            </div>
        );
    }

    // 3. Render the appropriate view based on ownership status
    return (
        <main className={styles.main}>
            <div className={styles.glassBackground}></div>
            <div className={styles.content}>
                {garment.is_registered ? (
                    <PassportDetails garment={garment} />
                ) : (
                    <OwnershipActivation garment={garment} />
                )}
            </div>
        </main>
    );
}
