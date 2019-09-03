import Dexie from 'dexie';
import { async } from 'q';

export class WalletDB extends Dexie {
  public opened: Promise<boolean>;
  defaultWalletKey: Dexie.Table<string, string>;
  defaultWalletPhrase: Dexie.Table<string, string>;
  defaultWalletChildIndex: Dexie.Table<number, string>;
  defaultWalletFile: Dexie.Table<any, string[]>;
  importedAccount: Dexie.Table<string, string>;
  constructor(databaseName: string) {
    super(databaseName);
    this.version(1).stores({
      defaultWalletKey: 'key',
      defaultWalletPhrase: 'phrase',
      defaultWalletChildIndex: 'index',
      defaultWalletFile: '[address+file]',
      importedAccount: 'address',
    });
    this.opened = this.init();
    this.defaultWalletKey = this.table('defaultWalletKey');
    this.defaultWalletPhrase = this.table('defaultWalletPhrase');
    this.defaultWalletChildIndex = this.table('defaultWalletChildIndex');
    this.defaultWalletFile = this.table('defaultWalletFile');
    this.importedAccount = this.table('importedAccount');
  }
  init = async () => {
    const opening = await this.open();
    return opening.isOpen();
  };
  saveKey = async (data: any) => {
    if (this.opened) {
      await this.defaultWalletKey.clear();
      const result = await this.defaultWalletKey.put(data);
      return result;
    }
  };
  loadKey = async () => {
    const result = await this.defaultWalletKey.toArray();
    return result[0];
  };
  savePhrase = async (data: any) => {
    if (this.opened) {
      await this.defaultWalletPhrase.clear();
      const result = await this.defaultWalletPhrase.put(data);
      return result;
    }
  };
  loadPhrase = async () => {
    const result = await this.defaultWalletPhrase.toArray();
    return result[0];
  };
  saveIndex = async (data: any) => {
    if (this.opened) {
      await this.defaultWalletChildIndex.clear();
      const result = await this.defaultWalletChildIndex.put(data);
      return result;
    }
  };
  loadIndex = async () => {
    const result = await this.defaultWalletChildIndex.toArray();
    return result[0];
  };
  saveFile = async (data: any) => {
    if (this.opened) {
      const isExist = await this.defaultWalletFile.get(data);

      const result = !isExist
        ? await this.defaultWalletFile.add(data)
        : await this.defaultWalletFile.put(data);
      return result;
    }
  };
  loadFile = async (address: string) => {
    if (this.opened) {
      const files = await this.loadFiles();
      return files.find((val: any) => val.address === address);
    }
  };
  loadFiles = async () => {
    const result = await this.defaultWalletFile.toArray();
    return result;
  };
  saveImported = async (data: any) => {
    if (this.opened) {
      const isExist = await this.getImported(data);
      const result = !isExist
        ? await this.importedAccount.add(data)
        : await this.importedAccount.put(data);
      return result;
    }
  };
  loadImported = async () => {
    if (this.opened) {
      const result = await this.importedAccount.toArray();
      return result;
    }
  };
  getImported = async (data: any) => {
    if (this.opened) {
      const result = await this.importedAccount.get(data);
      return result;
    }
  };
  removeFile = async (data: any) => {
    if (this.opened) {
      const isImported = await this.getImported(data);
      if (isImported) {
        await this.importedAccount.delete(data);
      }
      const isExist: any = await this.loadFile(data);
      if (isExist) {
        await this.defaultWalletFile.delete([isExist.address, isExist.file]);
        const savedKeys: any = await this.loadKey();
        const keyArray: string[] = JSON.parse(savedKeys.key);
        const index = keyArray.findIndex(val => val === isExist.address);
        keyArray.splice(index, 1);
        await this.saveKey({ key: JSON.stringify(keyArray) });
      }
    }
  };
}
