
import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { checkAdminAccess } from '@/lib/admin';
import { CompanyInfo } from '@/types';

// Default company info as fallback
const DEFAULT_COMPANY_INFO: CompanyInfo = {
    companyName: "REDMOON",
    tagline: "Digital Holding",
    foundedYear: 2024,
    contact: {
        email: "contact@redmoon.xyz",
        supportEmail: "support@redmoon.xyz"
    },
    social: {
        twitter: "https://twitter.com/redmoon",
        github: "https://github.com/redmoon",
        discord: "https://discord.gg/redmoon"
    },
    legal: {
        privacyPolicy: "# Privacy Policy\n\nYour privacy is important to us...",
        termsOfService: "# Terms of Service\n\nBy accessing our services..."
    },
    seo: {
        title: "Redmoon | Digital Holding",
        description: "Building the digital future through innovative applications and services.",
        keywords: ["redmoon", "software agency", "portfolio", "digital holding"]
    },
    branding: {
        logo: "/redmoon-logo.png",
        primaryColor: "#FF2A2A",
        secondaryColor: "#000000"
    }
};

/**
 * GET /api/settings/company
 * Fetch company information
 */
export async function GET() {
    try {
        // If Firebase is not configured, return default data
        if (!isFirebaseConfigured()) {
            return NextResponse.json({
                company: DEFAULT_COMPANY_INFO,
                source: 'static'
            });
        }

        const docRef = doc(db, 'settings', 'company');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return NextResponse.json({
                company: docSnap.data() as CompanyInfo,
                source: 'firestore'
            });
        } else {
            // Return default if no data in Firestore yet
            return NextResponse.json({
                company: DEFAULT_COMPANY_INFO,
                source: 'static_fallback'
            });
        }
    } catch (error) {
        console.error('Error fetching company info:', error);
        // Fallback on error
        return NextResponse.json({
            company: DEFAULT_COMPANY_INFO,
            source: 'static_error',
            error: 'Failed to fetch from Firestore'
        });
    }
}

/**
 * PUT /api/settings/company
 * Update company information - admin only
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

        // Validate basic requirements
        if (!body.companyName) {
            return NextResponse.json(
                { error: 'Company Name is required' },
                { status: 400 }
            );
        }

        const docRef = doc(db, 'settings', 'company');
        
        // Use setDoc to overwrite or create
        await setDoc(docRef, {
            ...body,
            updatedAt: new Date().toISOString()
        });

        return NextResponse.json({
            success: true,
            message: 'Company settings updated successfully'
        });
    } catch (error) {
        console.error('Error updating company info:', error);
        return NextResponse.json(
            { error: 'Failed to update company info' },
            { status: 500 }
        );
    }
}
