
let store = {
    data: {
        txs: [],
        stakeTxId: '',
        balance: 100,
        id: '',
        uid: '',
        privkey: '',
        address: '',
        stake: 20,
        email: '',
        coupon: ''
    },
    addTx(tx) {
        this.data.txs.push(tx);
        if (tx.action === "Register") {
            this.data.id= tx.id;
            this.data.uid= tx.uid;
            this.data.privkey = tx.privkey;
            this.data.address= tx.address;
            this.data.balance += tx.tokenChange;
        } else if (tx.action === "Stake") {
            this.data.stakeTxId = tx.txid;
            this.data.balance += tx.tokenChange;
        } else if (tx.action === "CompleteLevel") {
            this.data.balance += tx.tokenChange;
        }
    },
    getStakeTxId() {
        return this.data.stakeTxId;
    },
    getMultiplier() {
        return this.data.stake / 20;
    }
};

export default store;