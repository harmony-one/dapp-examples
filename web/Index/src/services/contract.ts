import request from '@/utils/request';

export async function queryContracts(): Promise<any> {
  return request('/api/getContracts');
}

export async function querySol(name: string): Promise<any> {
  return request(`/api/getSol?name=${name}`);
}

export async function getAbiBin(name: string): Promise<any> {
  return request(`/api/compileContract?name=${name}`);
}

export async function saveDeployed(name: string, payload: string): Promise<any> {
  return request(`/api/saveDeployed?name=${name}&&payload=${payload}`);
}

export async function getDeployed(name: string): Promise<any> {
  return request(`/api/getDeployed?name=${name}`);
}

export async function readDefaultContract(name: string): Promise<any> {
  return request(`/api/readDefaultContract?name=${name}`);
}

export async function setDefaultContract(name: string, address: string): Promise<any> {
  return request(`/api/setDefaultContract?name=${name}&&address=${address}`);
}
