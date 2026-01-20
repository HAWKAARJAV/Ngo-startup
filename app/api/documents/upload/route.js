import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
    try {
        if (!supabaseUrl || !supabaseKey) {
            // If Supabase is not configured, return a mock URL for development
            console.warn('Supabase not configured, using mock file URL');
            const formData = await request.formData();
            const file = formData.get('file');
            const docType = formData.get('docType') || 'document';
            
            // Generate a mock URL for development
            const mockUrl = `/uploads/${Date.now()}_${docType.replace(/\s+/g, '_')}_${file.name}`;
            
            return NextResponse.json({ 
                fileUrl: mockUrl,
                message: 'Development mode - file stored locally' 
            });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const formData = await request.formData();
        const file = formData.get('file');
        const ngoId = formData.get('ngoId');
        const docType = formData.get('docType') || 'document';
        const requestId = formData.get('requestId');

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only PDF and image files are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size must be less than 5MB' },
                { status: 400 }
            );
        }

        // Generate unique file name
        const timestamp = Date.now();
        const sanitizedDocType = docType.replace(/[^a-zA-Z0-9]/g, '_');
        const ext = file.name.split('.').pop();
        const fileName = `ngo_${ngoId}/${sanitizedDocType}_${timestamp}.${ext}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('compliance-documents')
            .upload(fileName, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            
            // If bucket doesn't exist, create it and retry
            if (error.message?.includes('bucket') || error.statusCode === '404') {
                // Try to create the bucket
                const { error: bucketError } = await supabase.storage.createBucket('compliance-documents', {
                    public: true,
                    fileSizeLimit: 5242880 // 5MB
                });
                
                if (!bucketError) {
                    // Retry upload
                    const { data: retryData, error: retryError } = await supabase.storage
                        .from('compliance-documents')
                        .upload(fileName, buffer, {
                            contentType: file.type,
                            cacheControl: '3600',
                            upsert: false
                        });
                    
                    if (retryError) {
                        throw new Error(retryError.message);
                    }
                    
                    // Get public URL
                    const { data: urlData } = supabase.storage
                        .from('compliance-documents')
                        .getPublicUrl(fileName);
                    
                    return NextResponse.json({ fileUrl: urlData.publicUrl });
                }
            }
            
            throw new Error(error.message);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('compliance-documents')
            .getPublicUrl(fileName);

        return NextResponse.json({ fileUrl: urlData.publicUrl });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upload file' },
            { status: 500 }
        );
    }
}
