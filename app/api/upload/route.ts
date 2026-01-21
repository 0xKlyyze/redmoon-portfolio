import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/admin';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(request: NextRequest) {
    try {
        // Authenticate
        const pin = request.headers.get('x-admin-pin') || undefined;
        const { isAdmin } = await checkAdminAccess(pin);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const folder = formData.get('folder') as string || 'uploads';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Create buffer
        const bytes = await file.arrayBuffer();
        const buffer = new Uint8Array(bytes);

        // Upload to Firebase
        // Sanitize filename to remove special characters but keep extension
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        const filename = `${Date.now()}-${originalName}`;
        const storageRef = ref(storage, `${folder}/${filename}`);

        await uploadBytes(storageRef, buffer, {
            contentType: file.type,
        });

        const url = await getDownloadURL(storageRef);

        return NextResponse.json({ url });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
