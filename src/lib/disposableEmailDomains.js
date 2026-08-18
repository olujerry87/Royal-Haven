/**
 * Blacklist of known disposable / temporary email domains.
 * Prevents promotional abuse via throwaway email accounts.
 */
const DISPOSABLE_DOMAINS = new Set([
    "mailinator.com",
    "10minutemail.com",
    "10minutemail.net",
    "trashmail.com",
    "trashmail.net",
    "guerrillamail.com",
    "guerrillamailblock.com",
    "guerrillamail.biz",
    "guerrillamail.org",
    "grr.la",
    "sharklasers.com",
    "tempmail.com",
    "temp-mail.org",
    "tempmailo.com",
    "dispostable.com",
    "yopmail.com",
    "yopmail.fr",
    "yopmail.net",
    "getnada.com",
    "throwawaymail.com",
    "maildrop.cc",
    "fakemailgenerator.com",
    "crazymailing.com",
    "emailondeck.com",
    "mohmal.com",
    "generator.email",
    "inboxbear.com",
    "dropmail.me",
    "getairmail.com",
    "disposablemail.com",
    "boun.cr",
    "mytrashmail.com",
    "tempinbox.com",
    "disposable.com",
    "mailna.co",
    "mytemp.email",
    "minuteinbox.com"
]);

/**
 * Check if an email address uses a disposable / temporary domain.
 * @param {string} email
 * @returns {boolean} true if email uses a disposable domain
 */
export function isDisposableEmail(email) {
    if (!email || typeof email !== "string" || !email.includes("@")) {
        return false;
    }

    const domain = email.trim().split("@").pop().toLowerCase();
    
    if (DISPOSABLE_DOMAINS.has(domain)) {
        return true;
    }

    // Pattern matching for typical temp mail domain signatures
    const tempKeywords = ["tempmail", "disposable", "throwaway", "trashmail", "fakeemail", "10minute", "mailinator"];
    return tempKeywords.some(keyword => domain.includes(keyword));
}
