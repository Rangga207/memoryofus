'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export interface Memory {
    id: string;
    title: string;
    content: string;
    date: string;
    emoji: string;
    color: string;
    imageUrl?: string;
}

const dbPath = path.join(process.cwd(), 'database.json');

async function getDb(): Promise<Memory[]> {
    noStore(); // Completely bypass Next.js aggressive caching for file reads!
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    } catch {
        // If file doesn't exist or is invalid, return empty array
        return [];
    }
}

async function saveDb(memories: Memory[]) {
    await fs.writeFile(dbPath, JSON.stringify(memories, null, 2), 'utf8');
}

export async function getMemories() {
    return await getDb();
}

export async function addMemory(data: { title: string; content: string; imageUrl?: string }) {
    const memories = await getDb();
    
    const newMemory: Memory = {
        id: Math.random().toString(36).substring(2, 15),
        title: data.title,
        content: data.content,
        emoji: '💌',
        color: '',
        imageUrl: data.imageUrl,
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
