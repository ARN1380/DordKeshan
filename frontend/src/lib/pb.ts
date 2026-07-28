import PocketBase from 'pocketbase';

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090';
const pb = new PocketBase(PB_URL);

export function getFileUrl(record: { id: string; collectionId: string; collectionName: string }, filename: string): string {
  const raw = pb.files.getURL(record, filename);
  if (PB_URL.includes('pocketbase:')) {
    return raw.replace('http://pocketbase:8090', '');
  }
  return raw;
}

export default pb;
