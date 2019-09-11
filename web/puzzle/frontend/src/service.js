import axios from "axios";
import store from "./store";

// const HTTP_BACKEND_URL = `https://us-central1-harmony-puzzle.cloudfunctions.net`;
// const HTTP_BACKEND_URL = `https://harmony-puzzle-backend.appspot.com`;
// const HTTP_BACKEND_URL = `https://d17b3244-d36f-40a1-959d-6a289de67a5b.mock.pstmn.io/`;

// const HTTP_BACKEND_URL = `https://bepuzzle.harmonyprotocol.com`;

const HTTP_BACKEND_URL = `https://benchmark-209420.appspot.com/`;

function sendPost(url, params) {
    return axios.post(HTTP_BACKEND_URL + url, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    });
}

export default {
    register(token) {
        return sendPost(
            token ? `/reg?token=${token}` : `/reg`,
        ).then((res) => {
            let data = res.data
            store.addTx({
                action: "Register",
                address: data.address,
                privkey: data.privkey,
                id: data.txid,
                uid: data.uid,
                tokenChange: (+data.balance) / 10 ** 18
            });
        })
    },
    stakeToken(key, stakeAmount) {
        return sendPost(
            `/play?accountKey=${key}&stake=${stakeAmount}`,
        ).then((res) => {
            store.addTx({
                action: "Stake",
                id: res.data.txid,
                tokenChange: -stakeAmount
            });
        });
    },
    completeLevel(key, height, moves) {
        return sendPost(
            `/finish?accountKey=${key}&height=${height}&sequence=${moves}`,
            {
                accountKey: key,
                height: height,
                sequence: moves
            }
        ).then((res) => {
            let rewards = 5 * store.getMultiplier();
            store.addTx({
                action: "CompleteLevel",
                id: res.data.txid,
                tokenChange: rewards
            });
            return rewards
        });
    },
    submitCoupon(coupon) {
        const payload = {"Coupon": coupon}
        return axios({
            url: HTTP_BACKEND_URL + `/user/${store.data.privkey}/coupon`,
            method: 'PUT',
            data: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
    },
    submitEmail(email) {
        return axios({
            url: HTTP_BACKEND_URL + `/user/${store.data.privkey}/email`,
            method: 'PUT',
            data: JSON.stringify(email),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
            .then(() => {
                store.data.email = email
            });
    },
};
