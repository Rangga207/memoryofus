'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export async function verifyLogin(email: string, pass: string): Promise<boolean> {
    // In a real app, this would check a database
    return email === 'katarinacakra230706@gmail.com' && pass === 'DwiCantikBGT';
}

export interface Memory {
    id: string;
    title: string;
    content: string;
    date: string;
    emoji: string;
    color: string;
    imageUrl?: string;
    imageUrls?: string[];
    isGalleryOnly?: boolean;
    hideFromGallery?: boolean;
}

const dbPath = path.join(process.cwd(), 'database.json');

async function getDb(): Promise<Memory[]> {
    noStore(); // Completely bypass Next.js aggressive caching for file reads!
    
    // 1. ONLINE PERSISTENCE: If Vercel/Upstash KV is configured, use it!
    const kvUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const kvToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    
    if (kvUrl && kvToken) {
        try {
            const headers = { Authorization: `Bearer ${kvToken}` };
            
            // First check if we are using the new chunked format
            const countRes = await fetch(`${kvUrl}/get/memories_count`, { headers, cache: 'no-store' });
            const countJson = await countRes.json();
            const count = parseInt(countJson.result);
            
            if (!isNaN(count) && count > 0) {
                // Fetch all chunks concurrently!
                const promises = Array.from({length: count}, (_, i) => 
                    fetch(`${kvUrl}/get/memories_chunk_${i}`, { headers, cache: 'no-store' }).then(r => r.json())
                );
                const results = await Promise.all(promises);
                const fullJsonStr = results.map(r => r.result).join('');
                
                if (fullJsonStr) {
                    const data = JSON.parse(fullJsonStr);
                    return Array.isArray(data) ? data : [];
                }
            } else {
                // Fallback to legacy single-key format if chunked doesn't exist
                const res = await fetch(`${kvUrl}/get/memories`, { headers, cache: 'no-store' });
                const json = await res.json();
                if (json.result) {
                    const data = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
                    return Array.isArray(data) ? data : [];
                }
            }
            return [];
        } catch (e) {
            console.error("Vercel KV Read Error:", e);
        }
    }

    // 2. LOCAL DEV FALLBACK: Write to local json file
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function saveDb(memories: Memory[]) {
    // 1. ONLINE PERSISTENCE: If Vercel/Upstash KV is configured, use it!
    const kvUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const kvToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (kvUrl && kvToken) {
        try {
            const headers = { 
                Authorization: `Bearer ${kvToken}`,
                'Content-Type': 'application/json'
            };
            
            const jsonStr = JSON.stringify(memories);
            // Chunk string into 500KB pieces (safely under 1MB request/response limit)
            const chunkSize = 500000;
            const chunks: string[] = [];
            for (let i = 0; i < jsonStr.length; i += chunkSize) {
                chunks.push(jsonStr.substring(i, i + chunkSize));
            }
            
            // 1. Save the chunk count
            const countRes = await fetch(`${kvUrl}/set/memories_count`, {
                method: 'POST',
                headers,
                body: chunks.length.toString()
            });
            
            if (!countRes.ok) {
                throw new Error(`Failed to set count: ${await countRes.text()}`);
            }

            // 2. Save each chunk sequentially to avoid rate limiting and ensure completion
            for (let i = 0; i < chunks.length; i++) {
                const chunkRes = await fetch(`${kvUrl}/set/memories_chunk_${i}`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(chunks[i])
                });
                if (!chunkRes.ok) {
                    throw new Error(`Failed to set chunk ${i}: ${await chunkRes.text()}`);
                }
            }
            
            return;
        } catch (e) {
            console.error("Vercel KV Write Error:", e);
            throw e; // Throw so the UI can catch it!
        }
    }

    // 2. LOCAL DEV FALLBACK: Write to local json file
    await fs.writeFile(dbPath, JSON.stringify(memories, null, 2), 'utf8');
}

export async function getMemories() {
    return await getDb();
}

export async function addMemory(data: { title: string; content: string; imageUrl?: string; imageUrls?: string[]; isGalleryOnly?: boolean; hideFromGallery?: boolean }) {
    const memories = await getDb();
    
    const newMemory: Memory = {
        id: Math.random().toString(36).substring(2, 15),
        title: data.title,
        content: data.content,
        emoji: '💌',
        color: '',
        imageUrl: data.imageUrl,
        imageUrls: data.imageUrls,
        isGalleryOnly: data.isGalleryOnly,
        hideFromGallery: data.hideFromGallery,
        date: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }),
    };
    
    const updated = [newMemory, ...memories];
    await saveDb(updated);
    
    revalidatePath('/');
    return newMemory;
}

export async function removeMemory(id: string) {
    const memories = await getDb();
    const updated = memories.filter(m => m.id !== id);
    await saveDb(updated);
    revalidatePath('/');
}

export async function updateMemory(id: string, data: Partial<Memory>) {
    const memories = await getDb();
    const currentDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const updated = memories.map(m => m.id === id ? { ...m, ...data, date: currentDate } : m);
    await saveDb(updated);
    revalidatePath('/');
    return updated.find(m => m.id === id);
}
