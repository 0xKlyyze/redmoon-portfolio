import { headers } from 'next/headers';

/**
 * Get the allowed admin IPs from environment variables
 */
export function getAllowedIPs(): string[] {
    const ipsString = process.env.ADMIN_ALLOWED_IPS || '127.0.0.1,::1';
    return ipsString.split(',').map(ip => ip.trim()).filter(Boolean);
}

/**
 * Get the admin PIN from environment variables (optional alternative to IP)
 */
export function getAdminPin(): string | null {
    return process.env.ADMIN_PIN || null;
}

/**
 * Extract client IP from request headers
 * Handles various proxy headers for accurate IP detection
 */
export async function getClientIP(): Promise<string> {
    const headersList = await headers();

    // Check common proxy headers in order of reliability
    const forwardedFor = headersList.get('x-forwarded-for');
    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, first one is the client
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = headersList.get('x-real-ip');
    if (realIP) {
        return realIP.trim();
    }

    // Vercel-specific header
    const vercelForwardedFor = headersList.get('x-vercel-forwarded-for');
    if (vercelForwardedFor) {
        return vercelForwardedFor.split(',')[0].trim();
    }

    // Fallback - this usually won't work behind proxies
    return '127.0.0.1';
}

/**
 * Check if an IP address is allowed admin access
 */
export function isAdminIP(ip: string): boolean {
    const allowedIPs = getAllowedIPs();

    // Normalize IPv6 localhost representations
    const normalizedIP = ip === '::1' ? '127.0.0.1' : ip;
    const normalizedAllowed = allowedIPs.map(allowed =>
        allowed === '::1' ? '127.0.0.1' : allowed
    );

    return normalizedAllowed.includes(normalizedIP);
}

/**
 * Check if a PIN matches the admin PIN
 */
export function isValidAdminPin(pin: string): boolean {
    const adminPin = getAdminPin();
    if (!adminPin) return false;
    return pin === adminPin;
}

/**
 * Main function to check admin access
 * Returns true if user has admin access via IP or PIN
 */
export async function checkAdminAccess(pin?: string): Promise<{
    isAdmin: boolean;
    method: 'ip' | 'pin' | 'none';
    clientIP: string;
}> {
    const clientIP = await getClientIP();

    // First check IP
    if (isAdminIP(clientIP)) {
        return { isAdmin: true, method: 'ip', clientIP };
    }

    // Then check PIN if provided
    if (pin && isValidAdminPin(pin)) {
        return { isAdmin: true, method: 'pin', clientIP };
    }

    return { isAdmin: false, method: 'none', clientIP };
}
