
import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess, isValidAdminPin, getClientIP } from '@/lib/admin';

export async function GET(request: NextRequest) {
    try {
        const pin = request.headers.get('x-admin-pin') || undefined;
        const { isAdmin, method, clientIP } = await checkAdminAccess(pin);

        return NextResponse.json({
            isAdmin,
            method,
            clientIP
        });
    } catch (error) {
        console.error('Error checking admin access:', error);
        return NextResponse.json(
            { isAdmin: false, method: 'none', error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { pin } = body;
        const clientIP = await getClientIP();

        if (pin && isValidAdminPin(pin)) {
            return NextResponse.json({
                isAdmin: true,
                method: 'pin',
                clientIP
            });
        }

        return NextResponse.json({
            isAdmin: false,
            method: 'none',
            clientIP,
            error: 'Invalid PIN'
        }, { status: 401 });

    } catch (error) {
        console.error('Error verifying admin PIN:', error);
        return NextResponse.json(
            { isAdmin: false, method: 'none', error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
