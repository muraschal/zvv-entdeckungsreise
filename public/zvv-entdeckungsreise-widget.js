/*! For license information please see zvv-entdeckungsreise-widget.js.LICENSE.txt */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react"),require("react-dom")):"function"==typeof define&&define.amd?define(["React","ReactDOM"],t):"object"==typeof exports?exports.ZVVEntdeckungsreiseWidget=t(require("react"),require("react-dom")):e.ZVVEntdeckungsreiseWidget=t(e.React,e.ReactDOM)}(this,((e,t)=>(()=>{"use strict";var r={156:t=>{t.exports=e},318:e=>{e.exports=t}},n={};function a(e){var t=n[e];if(void 0!==t)return t.exports;var o=n[e]={exports:{}};return r[e](o,o.exports,a),o.exports}a.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return a.d(t,{a:t}),t},a.d=(e,t)=>{for(var r in t)a.o(t,r)&&!a.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var o=a(156),i=a.n(o),c=a(318),l=a.n(c);function u(e){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u(e)}function s(){s=function(){return t};var e,t={},r=Object.prototype,n=r.hasOwnProperty,a=Object.defineProperty||function(e,t,r){e[t]=r.value},o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",c=o.asyncIterator||"@@asyncIterator",l=o.toStringTag||"@@toStringTag";function m(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{m({},"")}catch(e){m=function(e,t,r){return e[t]=r}}function f(e,t,r,n){var o=t&&t.prototype instanceof g?t:g,i=Object.create(o.prototype),c=new D(n||[]);return a(i,"_invoke",{value:P(e,r,c)}),i}function p(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}t.wrap=f;var d="suspendedStart",h="suspendedYield",v="executing",b="completed",y={};function g(){}function w(){}function E(){}var N={};m(N,i,(function(){return this}));var x=Object.getPrototypeOf,O=x&&x(x(T([])));O&&O!==r&&n.call(O,i)&&(N=O);var R=E.prototype=g.prototype=Object.create(N);function j(e){["next","throw","return"].forEach((function(t){m(e,t,(function(e){return this._invoke(t,e)}))}))}function S(e,t){function r(a,o,i,c){var l=p(e[a],e,o);if("throw"!==l.type){var s=l.arg,m=s.value;return m&&"object"==u(m)&&n.call(m,"__await")?t.resolve(m.__await).then((function(e){r("next",e,i,c)}),(function(e){r("throw",e,i,c)})):t.resolve(m).then((function(e){s.value=e,i(s)}),(function(e){return r("throw",e,i,c)}))}c(l.arg)}var o;a(this,"_invoke",{value:function(e,n){function a(){return new t((function(t,a){r(e,n,t,a)}))}return o=o?o.then(a,a):a()}})}function P(t,r,n){var a=d;return function(o,i){if(a===v)throw Error("Generator is already running");if(a===b){if("throw"===o)throw i;return{value:e,done:!0}}for(n.method=o,n.arg=i;;){var c=n.delegate;if(c){var l=k(c,n);if(l){if(l===y)continue;return l}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===d)throw a=b,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=v;var u=p(t,r,n);if("normal"===u.type){if(a=n.done?b:h,u.arg===y)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(a=b,n.method="throw",n.arg=u.arg)}}}function k(t,r){var n=r.method,a=t.iterator[n];if(a===e)return r.delegate=null,"throw"===n&&t.iterator.return&&(r.method="return",r.arg=e,k(t,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),y;var o=p(a,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,y;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,y):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,y)}function C(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function L(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function D(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(C,this),this.reset(!0)}function T(t){if(t||""===t){var r=t[i];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var a=-1,o=function r(){for(;++a<t.length;)if(n.call(t,a))return r.value=t[a],r.done=!1,r;return r.value=e,r.done=!0,r};return o.next=o}}throw new TypeError(u(t)+" is not iterable")}return w.prototype=E,a(R,"constructor",{value:E,configurable:!0}),a(E,"constructor",{value:w,configurable:!0}),w.displayName=m(E,l,"GeneratorFunction"),t.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===w||"GeneratorFunction"===(t.displayName||t.name))},t.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,E):(e.__proto__=E,m(e,l,"GeneratorFunction")),e.prototype=Object.create(R),e},t.awrap=function(e){return{__await:e}},j(S.prototype),m(S.prototype,c,(function(){return this})),t.AsyncIterator=S,t.async=function(e,r,n,a,o){void 0===o&&(o=Promise);var i=new S(f(e,r,n,a),o);return t.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},j(R),m(R,l,"Generator"),m(R,i,(function(){return this})),m(R,"toString",(function(){return"[object Generator]"})),t.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},t.values=T,D.prototype={constructor:D,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(L),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function a(n,a){return c.type="throw",c.arg=t,r.next=n,a&&(r.method="next",r.arg=e),!!a}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],c=i.completion;if("root"===i.tryLoc)return a("end");if(i.tryLoc<=this.prev){var l=n.call(i,"catchLoc"),u=n.call(i,"finallyLoc");if(l&&u){if(this.prev<i.catchLoc)return a(i.catchLoc,!0);if(this.prev<i.finallyLoc)return a(i.finallyLoc)}else if(l){if(this.prev<i.catchLoc)return a(i.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return a(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var a=this.tryEntries[r];if(a.tryLoc<=this.prev&&n.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var o=a;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=e,i.arg=t,o?(this.method="next",this.next=o.finallyLoc,y):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),y},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),L(r),y}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var a=n.arg;L(r)}return a}}throw Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:T(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),y}},t}function m(e,t,r,n,a,o,i){try{var c=e[o](i),l=c.value}catch(e){return void r(e)}c.done?t(l):Promise.resolve(l).then(n,a)}function f(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?f(Object(r),!0).forEach((function(t){d(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function d(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=u(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=u(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==u(t)?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function h(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,a,o,i,c=[],l=!0,u=!1;try{if(o=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;l=!1}else for(;!(l=(n=o.call(r)).done)&&(c.push(n.value),c.length!==t);l=!0);}catch(e){u=!0,a=e}finally{try{if(!l&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(u)throw a}}return c}}(e,t)||function(e,t){if(e){if("string"==typeof e)return v(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?v(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function v(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}function b(e){var t=e.apiBaseUrl,r=void 0===t?"":t,n=h((0,o.useState)({code:"",school:"",studentCount:"",travelDate:"",additionalNotes:"",email:"",className:"",contactPerson:"",phoneNumber:"",accompanistCount:"",arrivalTime:""}),2),a=n[0],i=n[1],c=h((0,o.useState)(!1),2),l=c[0],u=c[1],f=h((0,o.useState)(""),2),v=f[0],b=f[1],y=h((0,o.useState)(!1),2),g=y[0],w=y[1],E=function(e){var t=e.target,r=t.name,n=t.value;i((function(e){return p(p({},e),{},d({},r,n))}))},N=function(){var e,t=(e=s().mark((function e(t){var n,o,i,c;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),u(!0),b(""),!a.travelDate||(l=a.travelDate,s=void 0,m=void 0,s=new Date(l),(m=new Date).setHours(0,0,0,0),s>=m)){e.next=7;break}return b("Das Reisedatum muss in der Zukunft liegen."),u(!1),e.abrupt("return");case 7:return e.prev=7,e.next=10,fetch("".concat(r,"/api/validate"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:a.code})});case 10:return n=e.sent,e.next=13,n.json();case 13:if((o=e.sent).valid){e.next=18;break}return b(o.message||"Ungültiger Code"),u(!1),e.abrupt("return");case 18:return e.next=20,fetch("".concat(r,"/api/redeem"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:a.code,school:a.school,studentCount:parseInt(a.studentCount),travelDate:a.travelDate,additionalNotes:a.additionalNotes,email:a.email,className:a.className,contactPerson:a.contactPerson,phoneNumber:a.phoneNumber,accompanistCount:parseInt(a.accompanistCount||"0"),arrivalTime:a.arrivalTime})});case 20:return i=e.sent,e.next=23,i.json();case 23:c=e.sent,i.ok?w(!0):b(c.message||"Ein Fehler ist aufgetreten"),e.next=31;break;case 27:e.prev=27,e.t0=e.catch(7),b("Ein Fehler ist aufgetreten. Bitte versuche es später erneut."),console.error(e.t0);case 31:return e.prev=31,u(!1),e.finish(31);case 34:case"end":return e.stop()}var l,s,m}),e,null,[[7,27,31,34]])})),function(){var t=this,r=arguments;return new Promise((function(n,a){var o=e.apply(t,r);function i(e){m(o,n,a,i,c,"next",e)}function c(e){m(o,n,a,i,c,"throw",e)}i(void 0)}))});return function(e){return t.apply(this,arguments)}}();return g?React.createElement("div",{className:"max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md"},React.createElement("h1",{className:"text-2xl font-bold text-green-600 mb-4"},"Anmeldung erfolgreich!"),React.createElement("p",{className:"mb-4"},"Vielen Dank für deine Anmeldung zur ZVV-Entdeckungsreise."),React.createElement("p",{className:"mb-4"},"Wir haben deine Anfrage erhalten und eine Bestätigungs-E-Mail an dich gesendet."),React.createElement("button",{onClick:function(){return w(!1)},className:"w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"},"Zurück zum Formular")):React.createElement("div",{className:"max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md"},v&&React.createElement("div",{className:"mb-4 p-3 bg-red-100 text-red-700 rounded"},v),React.createElement("form",{onSubmit:N},React.createElement("div",{className:"mb-3"},React.createElement("label",{htmlFor:"code",className:"block mb-1"},"Ticketcode*"),React.createElement("input",{type:"text",id:"code",name:"code",value:a.code,onChange:E,required:!0,className:"w-full p-2 border"})),React.createElement("div",{className:"mb-3"},React.createElement("label",{htmlFor:"school",className:"block mb-1"},"Schule*"),React.createElement("input",{type:"text",id:"school",name:"school",value:a.school,onChange:E,required:!0,className:"w-full p-2 border"})),React.createElement("div",{className:"mb-3"},React.createElement("label",{htmlFor:"contactPerson",className:"block mb-1"},"Kontaktperson*"),React.createElement("input",{type:"text",id:"contactPerson",name:"contactPerson",value:a.contactPerson,onChange:E,required:!0,className:"w-full p-2 border"})),React.createElement("div",{className:"mb-3"},React.createElement("label",{htmlFor:"email",className:"block mb-1"},"E-Mail-Adresse*"),React.createElement("input",{type:"email",id:"email",name:"email",value:a.email,onChange:E,required:!0,className:"w-full p-2 border"})),React.createElement("div",{className:"mb-3"},React.createElement("label",{htmlFor:"phoneNumber",className:"block mb-1"},"Telefonnummer*"),React.createElement("input",{type:"tel",id:"phoneNumber",name:"phoneNumber",value:a.phoneNumber,onChange:E,required:!0,className:"w-full p-2 border"})),React.createElement("div",{className:"mb-3"},React.createElement("label",{htmlFor:"className",className:"block mb-1"},"Klasse*"),React.createElement("select",{id:"className",name:"className",value:a.className,onChange:E,required:!0,className:"w-full p-2 border"},React.createElement("option",{value:""},"Bitte wählen"),React.createElement("option",{value:"4. Klasse"},"4. Klasse"),React.createElement("option",{value:"5. Klasse"},"5. Klasse"),React.createElement("option",{value:"6. Klasse"},"6. Klasse"))),React.createElement("div",{className:"mb-3"},React.createElement("label",{htmlFor:"studentCount",className:"block mb-1"},"Anzahl Schüler*"),React.createElement("input",{type:"number",id:"studentCount",name:"studentCount",value:a.studentCount,onChange:E,required:!0,min:"1",className:"w-full p-2 border"})),React.createElement("div",{className:"mb-3"},React.createElement("label",{htmlFor:"accompanistCount",className:"block mb-1"},"Anzahl Begleitpersonen*"),React.createElement("input",{type:"number",id:"accompanistCount",name:"accompanistCount",value:a.accompanistCount,onChange:E,required:!0,min:"1",className:"w-full p-2 border"})),React.createElement("div",{className:"mb-3"},React.createElement("label",{htmlFor:"travelDate",className:"block mb-1"},"Gewünschtes Reisedatum*"),React.createElement("div",{className:"relative"},React.createElement("input",{type:"date",id:"travelDate",name:"travelDate",value:a.travelDate,onChange:E,required:!0,min:(new Date).toISOString().split("T")[0],className:"w-full p-2 border"}),React.createElement("div",{className:"text-xs text-gray-500 mt-1"},"Bitte wählen Sie ein Datum in der Zukunft"))),React.createElement("div",{className:"mb-3"},React.createElement("label",{htmlFor:"arrivalTime",className:"block mb-1"},"Ankunftszeit*"),React.createElement("div",{className:"relative"},React.createElement("input",{type:"time",id:"arrivalTime",name:"arrivalTime",value:a.arrivalTime,onChange:E,required:!0,className:"w-full p-2 border"}),React.createElement("div",{className:"text-xs text-gray-500 mt-1"},"Format: HH:MM (z.B. 09:30)"))),React.createElement("div",{className:"mb-4"},React.createElement("label",{htmlFor:"additionalNotes",className:"block mb-1"},"Zusätzliche Anmerkungen"),React.createElement("textarea",{id:"additionalNotes",name:"additionalNotes",value:a.additionalNotes,onChange:E,rows:3,className:"w-full p-2 border"})),React.createElement("button",{type:"submit",disabled:l,className:"w-full p-2 bg-blue-500 text-white rounded"},l?"Wird verarbeitet...":"Anmeldung absenden")))}function y(e){return y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},y(e)}function g(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function w(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=y(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=y(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==y(t)?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}return window.initZVVEntdeckungsreiseWidget=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=document.getElementById(e);if(r){var n=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?g(Object(r),!0).forEach((function(t){w(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):g(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({apiBaseUrl:t.apiBaseUrl||"https://entdeckungsreise.zvv.ch"},t);l().render(i().createElement(i().StrictMode,null,i().createElement(b,{apiBaseUrl:n.apiBaseUrl})),r)}else console.error('Container mit ID "'.concat(e,'" nicht gefunden.'))},{}})()));