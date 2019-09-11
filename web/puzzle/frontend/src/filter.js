import Vue from 'vue'
import moment from "moment";
export function formatTimestamp(timestamp) {
    return moment(timestamp).format('MM/DD/YYYY hh:mm:ss');
}

Vue.filter('timestamp', formatTimestamp);

export function shortenHash(hash) {
    if (!hash || hash.length <= 10) return hash;
    return hash.substr(0, 5) + "..." + hash.substr(hash.length - 5);
}
Vue.filter('shorten', shortenHash);

Vue.filter('time', (t) => {
    let minute = Math.floor(t / 60);
    let second = t % 60;
    return `${pad(minute)}:${pad(second)}`; 
});

function pad(v) {
    let s = v + '';
    if (s.length === 1) s = '0' + s;
    return s;
}