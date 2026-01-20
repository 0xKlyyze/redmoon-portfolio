import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { checkAdminAccess } from '@/lib/admin';
import { CompanyInfo } from '@/types';

const COLLECTION_NAME = 'settings';
const DOC_ID = 'company';

// Default company info (fallback when Firebase is not configured)
const DEFAULT_COMPANY_INFO: CompanyInfo = {
    companyName: 'Redmoon',
    tagline: 'Building the future of digital experiences',
    contact: {
        email: 'contact@example.com',
    },
    social: {},
    legal: {},
    branding: {},
    seo: {
        title: 'Redmoon - Digital Innovation',
        description: 'Explore our portfolio of cutting-edge digital products.',
    },
};

/**
 * GET /api/settings/company
 * Fetch company info - public endpoint
 */
export async function GET() {
    try {
        // If Firebase is not configured, return default data
        if (!isFirebaseConfigured()) {
            return NextResponse.json({
                company: DEFAULT_COMPANY_INFO,
                source: 'default'
            });
        }

        const docRef = doc(db, COLLECTION_NAME, DOC_ID);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json({
                company: DEFAULT_COMPANY_INFO,
                source: 'default'
            });
        }

        return NextResponse.json({
            company: docSnap.data() as CompanyInfo,
            source: 'firestore'
        });
    } catch (error) {
        console.error('Error fetching company info:', error);
        return NextResponse.json({
            company: DEFAULT_COMPANY_INFO,
            source: 'default',
            error: 'Failed to fetch from Firestore'
        });
    }
}

/**
 * PUT /api/settings/company
 * Update company info - admin only
 */
export async function PUT(request: NextRequest) {
    try {
        // Check admin access
        const pin = request.headers.get('x-admin-pin') || undefined;
        const { isAdmin, clientIP } = await checkAdminAccess(pin);

        if (!isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized', clientIP },
                { status: 403 }
            );
        }

        if (!isFirebaseConfigured()) {
            return NextResponse.json(
                { error: 'Firebase not configured' },
                { status: 500 }
            );
        }

        const body = await request.json();

        // Validate required fields
        if (!body.companyName) {
            return NextResponse.json(
                { error: 'Company name is required' },
                { status: 400 }
            );
        }

        // Update timestamp
        const companyData: CompanyInfo = {
            ...body,
            updatedAt: new Date().toISOString(),
        };

        const docRef = doc(db, COLLECTION_NAME, DOC_ID);
        await setDoc(docRef, companyData, { merge: true });

        return NextResponse.json({
            success: true,
            company: companyData
        });
    } catch (error) {
        console.error('Error updating company info:', error);
        return NextResponse.json(
            { error: 'Failed to update company info' },
            { status: 500 }
        );
    }
}
