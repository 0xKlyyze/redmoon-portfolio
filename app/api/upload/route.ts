export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '@/lib/firebase';
import { checkAdminAccess } from '@/lib/admin';

/**
 * POST /api/upload
 * Upload an image to Firebase Storage - admin only
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

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const folder = (formData.get('folder') as string) || 'uploads';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG' },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size: 5MB' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${folder}/${timestamp}_${sanitizedName}`;

        // Convert File to ArrayBuffer then to Uint8Array
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Upload to Firebase Storage
        const storageRef = ref(storage, filename);
        const snapshot = await uploadBytes(storageRef, uint8Array, {
            contentType: file.type,
        });

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return NextResponse.json({
            success: true,
            url: downloadURL,
            filename,
            contentType: file.type,
            size: file.size
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
