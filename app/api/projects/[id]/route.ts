import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { checkAdminAccess } from '@/lib/admin';
import { AsteroidData } from '@/types';
import { ASTEROIDS } from '@/data/asteroids';

const COLLECTION_NAME = 'projects';

interface RouteContext {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/projects/[id]
 * Fetch a single project by ID - public endpoint
 */
export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

        // If Firebase is not configured, return from static data
        if (!isFirebaseConfigured()) {
            const project = ASTEROIDS.find(a => a.id === id);
            if (!project) {
                return NextResponse.json(
                    { error: 'Project not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ project, source: 'static' });
        }

        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            // Fallback to static data
            const project = ASTEROIDS.find(a => a.id === id);
            if (!project) {
                return NextResponse.json(
                    { error: 'Project not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ project, source: 'static' });
        }

        return NextResponse.json({
            project: { id: docSnap.id, ...docSnap.data() } as AsteroidData,
            source: 'firestore'
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/projects/[id]
 * Update a project - admin only
 */
export async function PUT(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

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

        // Update timestamp
        const updateData = {
            ...body,
            updatedAt: new Date().toISOString(),
        };

        // Remove id from update data
        delete updateData.id;

        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, updateData);

        // Fetch updated document
        const updatedDoc = await getDoc(docRef);

        return NextResponse.json({
            success: true,
            project: { id: updatedDoc.id, ...updatedDoc.data() } as AsteroidData
        });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/projects/[id]
 * Delete a project - admin only
 */
export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

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

        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);

        return NextResponse.json({
            success: true,
            message: `Project ${id} deleted`
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}
