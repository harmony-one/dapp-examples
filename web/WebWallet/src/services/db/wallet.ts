import Dexie from 'dexie';
import { async } from 'q';



export class WalletDB extends Dexie {
    public opened: Promise<boolean>;
    defaultWalletKey: Dexie.Table<string, string>;
    defaultWalletPhrase: Dexie.Table<string, string>;
    defaultWalletChildIndex: Dexie.Table<number, string>
    defaultWalletFile: Dexie.Table<string, string>
    importedAccount: Dexie.Table<string, string>
    constructor(databaseName: string) {
        super(databaseName)
        this.version(1).stores({
            defaultWalletKey: 'key',
            defaultWalletPhrase: 'phrase',
            defaultWalletChildIndex: 'index',
            defaultWalletFile: 'file',
            importedAccount: 'address'
        })
        this.opened = this.init();
        this.defaultWalletKey = this.table('defaultWalletKey');
        this.defaultWalletPhrase = this.table('defaultWalletPhrase');
        this.defaultWalletChildIndex = this.table('defaultWalletChildIndex');
        this.defaultWalletFile = this.table('defaultWalletFile');
        this.importedAccount = this.table('importedAccount')
    }
    init = async () => {
        const opening = await this.open()
        return opening.isOpen()
    }
    saveKey = async (data: any) => {
        if (this.opened) {
            await this.defaultWalletKey.clear()
            const result = await this.defaultWalletKey.put(data)
            return result
        }
    }
    loadKey = async () => {
        const result = await this.defaultWalletKey.toArray()
        return result[0]
    }
    savePhrase = async (data: any) => {
        if (this.opened) {
            await this.defaultWalletPhrase.clear()
            const result = await this.defaultWalletPhrase.put(data)
            return result
        }
    }
    loadPhrase = async () => {
        const result = await this.defaultWalletPhrase.toArray()
        return result[0]
    }
    saveIndex = async (data: any) => {
        if (this.opened) {
            await this.defaultWalletChildIndex.clear()
            const result = await this.defaultWalletChildIndex.put(data)
            return result
        }
    }
    loadIndex = async () => {
        const result = await this.defaultWalletChildIndex.toArray()
        return result[0]
    }
    saveFile = async (data: any) => {
        if (this.opened) {
            await this.defaultWalletFile.clear()
            const result = await this.defaultWalletFile.put(data)
            return result
        }
    }
    loadFile = async () => {
        const result = await this.defaultWalletFile.toArray()
        return result[0]
    }
    saveImported = async (data: any) => {
        if (this.opened) {
            const isExist = await this.getImported(data)
            const result = !isExist
                ? await this.importedAccount.add(data)
                : await this.importedAccount.put(data)
            return result
        }
    }
    loadImported = async () => {
        if (this.opened) {
            const result = await this.importedAccount.toArray()
            return result
        }
    }
    getImported = async (data: any) => {
        if (this.opened) {
            const result = await this.importedAccount.get(data)
            return result
        }
    }

}


