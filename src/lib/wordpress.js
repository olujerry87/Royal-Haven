// WordPress REST API Configuration and Utilities
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8080';

/**
 * Generic fetch function for WordPress REST API
 * @param {string} endpoint - API endpoint (e.g., 'posts', 'pages', 'portfolio')
 * @param {object} params - Query parameters
 */
export async function fetchAPI(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${WP_URL}/wp-json/wp/v2/${endpoint}${queryString ? `?${queryString}` : ''}`;

    try {
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Handle 404 Not Found gracefully (return null, don't throw)
        if (res.status === 404) {
            return null;
        }

        if (!res.ok) {
            throw new Error(`WordPress API error: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        // Only log non-404 errors
        if (!error.message?.includes('404')) {
            console.error(`Error fetching from WordPress: ${endpoint}`, error);
        }
        throw error;
    }
}

/**
 * Fetch all posts
 */
export async function getPosts(params = {}) {
    return fetchAPI('posts', params);
}

/**
 * Fetch a single post by slug
 * @param {string} slug - Post slug
 */
export async function getPostBySlug(slug) {
    const posts = await fetchAPI('posts', { slug });
    return posts[0] || null;
}

/**
 * Fetch all pages
 */
export async function getPages(params = {}) {
    return fetchAPI('pages', params);
}

/**
 * Fetch a single page by slug
 * @param {string} slug - Page slug (e.g., 'home', 'about', 'services')
 */
export async function getPageBySlug(slug) {
    const pages = await fetchAPI('pages', { slug });
    return pages[0] || null;
}

/**
 * Fetch homepage data including ACF fields
 */
export async function getHomePageData() {
    const page = await getPageBySlug('home');
    if (!page) return null;

    // If using ACF to REST API plugin, fields are under 'acf'
    // If using native ACF REST API (recent versions), fields are under 'acf' in the page object itself
    // We'll normalize this
    if (page.acf) return page.acf;

    // Fallback: fetch ACF fields separately if not included in page object
    // This handles older setups or specific configurations
    return getACFFields(page.id);
}

/**
 * Fetch custom post type: Portfolio
 */
export async function getPortfolio(params = {}) {
    return fetchAPI('portfolio', params);
}

/**
 * Fetch custom post type: Testimonials
 */
export async function getTestimonials(params = {}) {
    return fetchAPI('testimonial', params);
}

/**
 * Fetch ACF (Advanced Custom Fields) for a specific page
 * Note: Requires ACF to REST API plugin to be installed
 * @param {number} pageId - WordPress page ID
 */
export async function getACFFields(pageId) {
    try {
        const res = await fetch(`${WP_URL}/wp-json/acf/v3/pages/${pageId}`);
        if (!res.ok) {
            console.warn(`ACF fields not available for page ${pageId}. Make sure ACF to REST API plugin is installed.`);
            return {};
        }
        const data = await res.json();
        return data.acf || {};
    } catch (error) {
        console.error(`Error fetching ACF fields for page ${pageId}:`, error);
        return {};
    }
}

/**
 * Fetch media/images from WordPress Media Library
 * @param {number} mediaId - WordPress media ID
 */
export async function getMedia(mediaId) {
    return fetchAPI(`media/${mediaId}`);
}

/**
 * Fetch all media
 */
export async function getAllMedia(params = {}) {
    return fetchAPI('media', params);
}

/**
 * Search WordPress content
 * @param {string} searchTerm - Search query
 */
export async function searchContent(searchTerm) {
    return fetchAPI('search', { search: searchTerm });
}
