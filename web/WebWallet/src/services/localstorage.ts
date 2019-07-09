export const read = (key: string) => {
  return localStorage.getItem(key);
};

export const readObject = (key: string) => {
  const text: string | null = read(key);
  let obj = {};
  try {
    if (text) {
      obj = JSON.parse(text);
    }
  } catch (error) {
    throw error;
  }
  return obj;
};

export const write = (key: string, data: any) => {
  localStorage.setItem(key, data);
};

export const writeObject = (key: string, data: any) => {
  const text = JSON.stringify(data);
  write(key, text);
};

export const remove = (key: string) => {
  localStorage.removeItem(key);
};
