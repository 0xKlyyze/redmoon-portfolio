
import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { checkAdminAccess } from '@/lib/admin';
import { AsteroidData } from '@/types';
import { ASTEROIDS } from '@/data/asteroids';

const COLLECTION_NAME = 'projects';

/**
 * GET /api/projects
 * Fetch all projects - public endpoint
 */
export async function GET() {
    try {
        // If Firebase is not configured, return static data
        if (!isFirebaseConfigured()) {
            return NextResponse.json({
                projects: ASTEROIDS,
                source: 'static'
            });
        }

        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const projects: AsteroidData[] = [];

        querySnapshot.forEach((doc) => {
            projects.push({
                id: doc.id,
                ...doc.data()
            } as AsteroidData);
        });

        // If no projects in Firestore, return static data
        if (projects.length === 0) {
            return NextResponse.json({
                projects: ASTEROIDS,
                source: 'static'
            });
        }

        return NextResponse.json({
            projects,
            source: 'firestore'
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to static data on error
        return NextResponse.json({
            projects: ASTEROIDS,
            source: 'static',
            error: 'Failed to fetch from Firestore'
        });
    }
}

/**
 * POST /api/projects
 * Create a new project - admin only
 */
export async function POST(request: NextRequest) {
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
        const requiredFields = ['name', 'tagline', 'status'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Add timestamps
        const projectData = {
            ...body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Remove id if present (Firestore will generate one)
        delete projectData.id;

        const docRef = await addDoc(collection(db, COLLECTION_NAME), projectData);

        return NextResponse.json({
            success: true,
            id: docRef.id,
            project: { id: docRef.id, ...projectData }
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
