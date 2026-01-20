import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/admin';

/**
 * GET /api/admin/check
 * Check if the current user has admin access
 */
export async function GET(request: NextRequest) {
    try {
        const { isAdmin, method, clientIP } = await checkAdminAccess();

        // Debug logging (check server console)
        console.log('[Admin Check API] Client IP:', clientIP);
        console.log('[Admin Check API] Allowed IPs:', process.env.ADMIN_ALLOWED_IPS);
        console.log('[Admin Check API] Is Admin:', isAdmin, 'Method:', method);

        return NextResponse.json({
            isAdmin,
            method,
            clientIP
        });
    } catch (error) {
        console.error('Error checking admin status:', error);
        return NextResponse.json({
            isAdmin: false,
            method: 'none',
            error: 'Failed to check admin status'
        });
    }
}

/**
 * POST /api/admin/check
 * Check if a provided PIN grants admin access
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const pin = body.pin;

        if (!pin) {
            return NextResponse.json(
                { error: 'PIN is required' },
                { status: 400 }
            );
        }

        const { isAdmin, method, clientIP } = await checkAdminAccess(pin);

        return NextResponse.json({
            isAdmin,
            method,
            clientIP
        });
    } catch (error) {
        console.error('Error checking admin PIN:', error);
        return NextResponse.json({
            isAdmin: false,
            method: 'none',
            error: 'Failed to verify PIN'
        });
    }
}
