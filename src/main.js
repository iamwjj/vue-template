import Vue from 'vue'
import App from './App'

new Vue({
    el: '#app',
    render: h => h(App)
})

let fn = () => {
    let arr = [1,2,3]
    console.log(arr.includes(2))
}
fn();

const key = 'babel'
const obj = {
    [key]: 'foo',
}

Array.from(new Set([1,2,3]))