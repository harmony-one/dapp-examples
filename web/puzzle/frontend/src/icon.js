import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faSync,
    faPlus,
    faMinus,
    faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
    faSync,
    faPlus,
    faMinus,
    faExternalLinkAlt
)

Vue.component('font-awesome-icon', FontAwesomeIcon)