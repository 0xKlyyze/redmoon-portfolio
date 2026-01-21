
import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
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
