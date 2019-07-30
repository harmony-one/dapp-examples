import { request } from '@/utils/request';

export async function readDefaultContract() {
  return request('/api/readDefaultContract?name=lottery');
}
