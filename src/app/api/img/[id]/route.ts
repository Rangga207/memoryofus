import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const kvUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const kvToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    
    if (!kvUrl || !kvToken) {
        return new NextResponse('KV not configured', { status: 500 });
    }

    try {
        const res = await fetch(`${kvUrl}/get/img_${id}`, {
            headers: { Authorization: `Bearer ${kvToken}` },
            cache: 'force-cache',
        });
        
        const json = await res.json();
        if (!json.result) {
            return new NextResponse('Not found', { status: 404 });
        }

        const base64Data = json.result.split(',')[1] || json.result;
        const buffer = Buffer.from(base64Data, 'base64');
        
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (e) {
        console.error("Error fetching image from KV:", e);
        return new NextResponse('Internal error', { status: 500 });
    }
}
