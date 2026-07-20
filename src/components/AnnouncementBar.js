import styles from './AnnouncementBar.module.css';
import { getPageBySlug } from '@/lib/wordpress';

export default async function AnnouncementBar() {
    let content = "FREE SHIPPING ... | 100% Natural & Made in Canada";
    
    try {
        const page = await getPageBySlug('announcement-bar');
        if (page && page.content && page.content.rendered) {
            // Strip outermost wrapping paragraphs if they exist to keep it inline
            let html = page.content.rendered.replace(/^<p>/, '').replace(/<\/p>\s*$/, '');
            content = html;
            
            return (
                <div className={styles.bar}>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            );
        }
    } catch (error) {
        console.warn("Could not fetch Announcement Bar from WordPress");
    }

    return (
        <div className={styles.bar}>
            <p>FREE SHIPPING over $150 | 100% Proudly Made in Canada</p>
        </div>
    );
}
