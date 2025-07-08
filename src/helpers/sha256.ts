import { createHash } from 'crypto';

function generateSHA256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}