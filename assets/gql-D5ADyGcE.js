var yt=Object.defineProperty;var Me=t=>{throw TypeError(t)};var gt=(t,e,n)=>e in t?yt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var be=(t,e,n)=>gt(t,typeof e!="symbol"?e+"":e,n),we=(t,e,n)=>e.has(t)||Me("Cannot "+n);var s=(t,e,n)=>(we(t,e,"read from private field"),n?n.call(t):e.get(t)),p=(t,e,n)=>e.has(t)?Me("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,n),o=(t,e,n,r)=>(we(t,e,"write to private field"),r?r.call(t,n):e.set(t,n),n),g=(t,e,n)=>(we(t,e,"access private method"),n);import{a as U,p as vt}from"./chunk-OIYGIGL5-CVJ-uJPG.js";var ze=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(t){return this.listeners.add(t),this.onSubscribe(),()=>{this.listeners.delete(t),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}},bt={setTimeout:(t,e)=>setTimeout(t,e),clearTimeout:t=>clearTimeout(t),setInterval:(t,e)=>setInterval(t,e),clearInterval:t=>clearInterval(t)},$,Be,Je,Pt=(Je=class{constructor(){p(this,$,bt);p(this,Be,!1)}setTimeoutProvider(t){o(this,$,t)}setTimeout(t,e){return s(this,$).setTimeout(t,e)}clearTimeout(t){s(this,$).clearTimeout(t)}setInterval(t,e){return s(this,$).setInterval(t,e)}clearInterval(t){s(this,$).clearInterval(t)}},$=new WeakMap,Be=new WeakMap,Je),V=new Pt;function wt(t){setTimeout(t,0)}var te=typeof window>"u"||"Deno"in globalThis;function pe(){}function Pn(t,e){return typeof t=="function"?t(e):t}function Se(t){return typeof t=="number"&&t>=0&&t!==1/0}function st(t,e){return Math.max(t+(e||0)-Date.now(),0)}function se(t,e){return typeof t=="function"?t(e):t}function F(t,e){return typeof t=="function"?t(e):t}function wn(t,e){const{type:n="all",exact:r,fetchStatus:i,predicate:a,queryKey:c,stale:u}=t;if(c){if(r){if(e.queryHash!==Ct(c,e.options))return!1}else if(!Ne(e.queryKey,c))return!1}if(n!=="all"){const l=e.isActive();if(n==="active"&&!l||n==="inactive"&&l)return!1}return!(typeof u=="boolean"&&e.isStale()!==u||i&&i!==e.state.fetchStatus||a&&!a(e))}function Cn(t,e){const{exact:n,status:r,predicate:i,mutationKey:a}=t;if(a){if(!e.options.mutationKey)return!1;if(n){if(Re(e.options.mutationKey)!==Re(a))return!1}else if(!Ne(e.options.mutationKey,a))return!1}return!(r&&e.state.status!==r||i&&!i(e))}function Ct(t,e){return((e==null?void 0:e.queryKeyHashFn)||Re)(t)}function Re(t){return JSON.stringify(t,(e,n)=>De(n)?Object.keys(n).sort().reduce((r,i)=>(r[i]=n[i],r),{}):n)}function Ne(t,e){return t===e?!0:typeof t!=typeof e?!1:t&&e&&typeof t=="object"&&typeof e=="object"?Object.keys(e).every(n=>Ne(t[n],e[n])):!1}var St=Object.prototype.hasOwnProperty;function rt(t,e){if(t===e)return t;const n=Qe(t)&&Qe(e);if(!n&&!(De(t)&&De(e)))return e;const i=(n?t:Object.keys(t)).length,a=n?e:Object.keys(e),c=a.length,u=n?new Array(c):{};let l=0;for(let b=0;b<c;b++){const C=n?b:a[b],f=t[C],S=e[C];if(f===S){u[C]=f,(n?b<i:St.call(t,C))&&l++;continue}if(f===null||S===null||typeof f!="object"||typeof S!="object"){u[C]=S;continue}const y=rt(f,S);u[C]=y,y===f&&l++}return i===c&&l===i?t:u}function Ie(t,e){if(!e||Object.keys(t).length!==Object.keys(e).length)return!1;for(const n in t)if(t[n]!==e[n])return!1;return!0}function Qe(t){return Array.isArray(t)&&t.length===Object.keys(t).length}function De(t){if(!Ve(t))return!1;const e=t.constructor;if(e===void 0)return!0;const n=e.prototype;return!(!Ve(n)||!n.hasOwnProperty("isPrototypeOf")||Object.getPrototypeOf(t)!==Object.prototype)}function Ve(t){return Object.prototype.toString.call(t)==="[object Object]"}function Rt(t){return new Promise(e=>{V.setTimeout(e,t)})}function Ee(t,e,n){return typeof n.structuralSharing=="function"?n.structuralSharing(t,e):n.structuralSharing!==!1?rt(t,e):e}function Sn(t){return t}function Rn(t,e,n=0){const r=[...t,e];return n&&r.length>n?r.slice(1):r}function In(t,e,n=0){const r=[e,...t];return n&&r.length>n?r.slice(0,-1):r}var it=Symbol();function It(t,e){return!t.queryFn&&(e!=null&&e.initialPromise)?()=>e.initialPromise:!t.queryFn||t.queryFn===it?()=>Promise.reject(new Error(`Missing queryFn: '${t.queryHash}'`)):t.queryFn}function Dt(t,e){return typeof t=="function"?t(...e):!!t}var W,k,re,Ze,Et=(Ze=class extends ze{constructor(){super();p(this,W);p(this,k);p(this,re);o(this,re,e=>{if(!te&&window.addEventListener){const n=()=>e();return window.addEventListener("visibilitychange",n,!1),()=>{window.removeEventListener("visibilitychange",n)}}})}onSubscribe(){s(this,k)||this.setEventListener(s(this,re))}onUnsubscribe(){var e;this.hasListeners()||((e=s(this,k))==null||e.call(this),o(this,k,void 0))}setEventListener(e){var n;o(this,re,e),(n=s(this,k))==null||n.call(this),o(this,k,e(r=>{typeof r=="boolean"?this.setFocused(r):this.onFocus()}))}setFocused(e){s(this,W)!==e&&(o(this,W,e),this.onFocus())}onFocus(){const e=this.isFocused();this.listeners.forEach(n=>{n(e)})}isFocused(){var e;return typeof s(this,W)=="boolean"?s(this,W):((e=globalThis.document)==null?void 0:e.visibilityState)!=="hidden"}},W=new WeakMap,k=new WeakMap,re=new WeakMap,Ze),at=new Et;function _e(){let t,e;const n=new Promise((i,a)=>{t=i,e=a});n.status="pending",n.catch(()=>{});function r(i){Object.assign(n,i),delete n.resolve,delete n.reject}return n.resolve=i=>{r({status:"fulfilled",value:i}),t(i)},n.reject=i=>{r({status:"rejected",reason:i}),e(i)},n}var _t=wt;function Tt(){let t=[],e=0,n=u=>{u()},r=u=>{u()},i=_t;const a=u=>{e?t.push(u):i(()=>{n(u)})},c=()=>{const u=t;t=[],u.length&&i(()=>{r(()=>{u.forEach(l=>{n(l)})})})};return{batch:u=>{let l;e++;try{l=u()}finally{e--,e||c()}return l},batchCalls:u=>(...l)=>{a(()=>{u(...l)})},schedule:a,setNotifyFunction:u=>{n=u},setBatchNotifyFunction:u=>{r=u},setScheduler:u=>{i=u}}}var $e=Tt(),ie,L,ae,Xe,Ot=(Xe=class extends ze{constructor(){super();p(this,ie,!0);p(this,L);p(this,ae);o(this,ae,e=>{if(!te&&window.addEventListener){const n=()=>e(!0),r=()=>e(!1);return window.addEventListener("online",n,!1),window.addEventListener("offline",r,!1),()=>{window.removeEventListener("online",n),window.removeEventListener("offline",r)}}})}onSubscribe(){s(this,L)||this.setEventListener(s(this,ae))}onUnsubscribe(){var e;this.hasListeners()||((e=s(this,L))==null||e.call(this),o(this,L,void 0))}setEventListener(e){var n;o(this,ae,e),(n=s(this,L))==null||n.call(this),o(this,L,e(this.setOnline.bind(this)))}setOnline(e){s(this,ie)!==e&&(o(this,ie,e),this.listeners.forEach(r=>{r(e)}))}isOnline(){return s(this,ie)}},ie=new WeakMap,L=new WeakMap,ae=new WeakMap,Xe),ot=new Ot;function At(t){return Math.min(1e3*2**t,3e4)}function ut(t){return(t??"online")==="online"?ot.isOnline():!0}var Te=class extends Error{constructor(t){super("CancelledError"),this.revert=t==null?void 0:t.revert,this.silent=t==null?void 0:t.silent}};function Ft(t){let e=!1,n=0,r;const i=_e(),a=()=>i.status!=="pending",c=P=>{var v;if(!a()){const w=new Te(P);S(w),(v=t.onCancel)==null||v.call(t,w)}},u=()=>{e=!0},l=()=>{e=!1},b=()=>at.isFocused()&&(t.networkMode==="always"||ot.isOnline())&&t.canRun(),C=()=>ut(t.networkMode)&&t.canRun(),f=P=>{a()||(r==null||r(),i.resolve(P))},S=P=>{a()||(r==null||r(),i.reject(P))},y=()=>new Promise(P=>{var v;r=w=>{(a()||b())&&P(w)},(v=t.onPause)==null||v.call(t)}).then(()=>{var P;r=void 0,a()||(P=t.onContinue)==null||P.call(t)}),_=()=>{if(a())return;let P;const v=n===0?t.initialPromise:void 0;try{P=v??t.fn()}catch(w){P=Promise.reject(w)}Promise.resolve(P).then(f).catch(w=>{var N;if(a())return;const T=t.retry??(te?0:3),G=t.retryDelay??At,h=typeof G=="function"?G(n,w):G,x=T===!0||typeof T=="number"&&n<T||typeof T=="function"&&T(n,w);if(e||!x){S(w);return}n++,(N=t.onFail)==null||N.call(t,n,w),Rt(h).then(()=>b()?void 0:y()).then(()=>{e?S(w):_()})})};return{promise:i,status:()=>i.status,cancel:c,continue:()=>(r==null||r(),i),cancelRetry:u,continueRetry:l,canStart:C,start:()=>(C()?_():y().then(_),i)}}var K,et,Ut=(et=class{constructor(){p(this,K)}destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),Se(this.gcTime)&&o(this,K,V.setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(t){this.gcTime=Math.max(this.gcTime||0,t??(te?1/0:300*1e3))}clearGcTimeout(){s(this,K)&&(V.clearTimeout(s(this,K)),o(this,K,void 0))}},K=new WeakMap,et),Y,oe,A,H,R,fe,J,q,B,tt,Dn=(tt=class extends Ut{constructor(e){super();p(this,q);p(this,Y);p(this,oe);p(this,A);p(this,H);p(this,R);p(this,fe);p(this,J);o(this,J,!1),o(this,fe,e.defaultOptions),this.setOptions(e.options),this.observers=[],o(this,H,e.client),o(this,A,s(this,H).getQueryCache()),this.queryKey=e.queryKey,this.queryHash=e.queryHash,o(this,Y,We(this.options)),this.state=e.state??s(this,Y),this.scheduleGc()}get meta(){return this.options.meta}get promise(){var e;return(e=s(this,R))==null?void 0:e.promise}setOptions(e){if(this.options={...s(this,fe),...e},this.updateGcTime(this.options.gcTime),this.state&&this.state.data===void 0){const n=We(this.options);n.data!==void 0&&(this.setData(n.data,{updatedAt:n.dataUpdatedAt,manual:!0}),o(this,Y,n))}}optionalRemove(){!this.observers.length&&this.state.fetchStatus==="idle"&&s(this,A).remove(this)}setData(e,n){const r=Ee(this.state.data,e,this.options);return g(this,q,B).call(this,{data:r,type:"success",dataUpdatedAt:n==null?void 0:n.updatedAt,manual:n==null?void 0:n.manual}),r}setState(e,n){g(this,q,B).call(this,{type:"setState",state:e,setStateOptions:n})}cancel(e){var r,i;const n=(r=s(this,R))==null?void 0:r.promise;return(i=s(this,R))==null||i.cancel(e),n?n.then(pe).catch(pe):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}reset(){this.destroy(),this.setState(s(this,Y))}isActive(){return this.observers.some(e=>F(e.options.enabled,this)!==!1)}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===it||this.state.dataUpdateCount+this.state.errorUpdateCount===0}isStatic(){return this.getObserversCount()>0?this.observers.some(e=>se(e.options.staleTime,this)==="static"):!1}isStale(){return this.getObserversCount()>0?this.observers.some(e=>e.getCurrentResult().isStale):this.state.data===void 0||this.state.isInvalidated}isStaleByTime(e=0){return this.state.data===void 0?!0:e==="static"?!1:this.state.isInvalidated?!0:!st(this.state.dataUpdatedAt,e)}onFocus(){var n;const e=this.observers.find(r=>r.shouldFetchOnWindowFocus());e==null||e.refetch({cancelRefetch:!1}),(n=s(this,R))==null||n.continue()}onOnline(){var n;const e=this.observers.find(r=>r.shouldFetchOnReconnect());e==null||e.refetch({cancelRefetch:!1}),(n=s(this,R))==null||n.continue()}addObserver(e){this.observers.includes(e)||(this.observers.push(e),this.clearGcTimeout(),s(this,A).notify({type:"observerAdded",query:this,observer:e}))}removeObserver(e){this.observers.includes(e)&&(this.observers=this.observers.filter(n=>n!==e),this.observers.length||(s(this,R)&&(s(this,J)?s(this,R).cancel({revert:!0}):s(this,R).cancelRetry()),this.scheduleGc()),s(this,A).notify({type:"observerRemoved",query:this,observer:e}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||g(this,q,B).call(this,{type:"invalidate"})}async fetch(e,n){var l,b,C,f,S,y,_,P,v,w,T,G;if(this.state.fetchStatus!=="idle"&&((l=s(this,R))==null?void 0:l.status())!=="rejected"){if(this.state.data!==void 0&&(n!=null&&n.cancelRefetch))this.cancel({silent:!0});else if(s(this,R))return s(this,R).continueRetry(),s(this,R).promise}if(e&&this.setOptions(e),!this.options.queryFn){const h=this.observers.find(x=>x.options.queryFn);h&&this.setOptions(h.options)}const r=new AbortController,i=h=>{Object.defineProperty(h,"signal",{enumerable:!0,get:()=>(o(this,J,!0),r.signal)})},a=()=>{const h=It(this.options,n),N=(()=>{const Pe={client:s(this,H),queryKey:this.queryKey,meta:this.meta};return i(Pe),Pe})();return o(this,J,!1),this.options.persister?this.options.persister(h,N,this):h(N)},u=(()=>{const h={fetchOptions:n,options:this.options,queryKey:this.queryKey,client:s(this,H),state:this.state,fetchFn:a};return i(h),h})();(b=this.options.behavior)==null||b.onFetch(u,this),o(this,oe,this.state),(this.state.fetchStatus==="idle"||this.state.fetchMeta!==((C=u.fetchOptions)==null?void 0:C.meta))&&g(this,q,B).call(this,{type:"fetch",meta:(f=u.fetchOptions)==null?void 0:f.meta}),o(this,R,Ft({initialPromise:n==null?void 0:n.initialPromise,fn:u.fetchFn,onCancel:h=>{h instanceof Te&&h.revert&&this.setState({...s(this,oe),fetchStatus:"idle"}),r.abort()},onFail:(h,x)=>{g(this,q,B).call(this,{type:"failed",failureCount:h,error:x})},onPause:()=>{g(this,q,B).call(this,{type:"pause"})},onContinue:()=>{g(this,q,B).call(this,{type:"continue"})},retry:u.options.retry,retryDelay:u.options.retryDelay,networkMode:u.options.networkMode,canRun:()=>!0}));try{const h=await s(this,R).start();if(h===void 0)throw new Error(`${this.queryHash} data is undefined`);return this.setData(h),(y=(S=s(this,A).config).onSuccess)==null||y.call(S,h,this),(P=(_=s(this,A).config).onSettled)==null||P.call(_,h,this.state.error,this),h}catch(h){if(h instanceof Te){if(h.silent)return s(this,R).promise;if(h.revert){if(this.state.data===void 0)throw h;return this.state.data}}throw g(this,q,B).call(this,{type:"error",error:h}),(w=(v=s(this,A).config).onError)==null||w.call(v,h,this),(G=(T=s(this,A).config).onSettled)==null||G.call(T,this.state.data,h,this),h}finally{this.scheduleGc()}}},Y=new WeakMap,oe=new WeakMap,A=new WeakMap,H=new WeakMap,R=new WeakMap,fe=new WeakMap,J=new WeakMap,q=new WeakSet,B=function(e){const n=r=>{switch(e.type){case"failed":return{...r,fetchFailureCount:e.failureCount,fetchFailureReason:e.error};case"pause":return{...r,fetchStatus:"paused"};case"continue":return{...r,fetchStatus:"fetching"};case"fetch":return{...r,...ct(r.data,this.options),fetchMeta:e.meta??null};case"success":const i={...r,data:e.data,dataUpdateCount:r.dataUpdateCount+1,dataUpdatedAt:e.dataUpdatedAt??Date.now(),error:null,isInvalidated:!1,status:"success",...!e.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return o(this,oe,e.manual?i:void 0),i;case"error":const a=e.error;return{...r,error:a,errorUpdateCount:r.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:r.fetchFailureCount+1,fetchFailureReason:a,fetchStatus:"idle",status:"error"};case"invalidate":return{...r,isInvalidated:!0};case"setState":return{...r,...e.state}}};this.state=n(this.state),$e.batch(()=>{this.observers.forEach(r=>{r.onQueryUpdate()}),s(this,A).notify({query:this,type:"updated",action:e})})},tt);function ct(t,e){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:ut(e.networkMode)?"fetching":"paused",...t===void 0&&{error:null,status:"pending"}}}function We(t){const e=typeof t.initialData=="function"?t.initialData():t.initialData,n=e!==void 0,r=n?typeof t.initialDataUpdatedAt=="function"?t.initialDataUpdatedAt():t.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:n?r??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:n?"success":"pending",fetchStatus:"idle"}}var E,d,me,D,Z,ue,z,M,ye,ce,le,X,ee,Q,he,m,de,Oe,Ae,Fe,Ue,qe,Ge,je,lt,nt,qt=(nt=class extends ze{constructor(e,n){super();p(this,m);p(this,E);p(this,d);p(this,me);p(this,D);p(this,Z);p(this,ue);p(this,z);p(this,M);p(this,ye);p(this,ce);p(this,le);p(this,X);p(this,ee);p(this,Q);p(this,he,new Set);this.options=n,o(this,E,e),o(this,M,null),o(this,z,_e()),this.bindMethods(),this.setOptions(n)}bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(s(this,d).addObserver(this),Ke(s(this,d),this.options)?g(this,m,de).call(this):this.updateResult(),g(this,m,Ue).call(this))}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return xe(s(this,d),this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return xe(s(this,d),this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,g(this,m,qe).call(this),g(this,m,Ge).call(this),s(this,d).removeObserver(this)}setOptions(e){const n=this.options,r=s(this,d);if(this.options=s(this,E).defaultQueryOptions(e),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof F(this.options.enabled,s(this,d))!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");g(this,m,je).call(this),s(this,d).setOptions(this.options),n._defaulted&&!Ie(this.options,n)&&s(this,E).getQueryCache().notify({type:"observerOptionsUpdated",query:s(this,d),observer:this});const i=this.hasListeners();i&&Ye(s(this,d),r,this.options,n)&&g(this,m,de).call(this),this.updateResult(),i&&(s(this,d)!==r||F(this.options.enabled,s(this,d))!==F(n.enabled,s(this,d))||se(this.options.staleTime,s(this,d))!==se(n.staleTime,s(this,d)))&&g(this,m,Oe).call(this);const a=g(this,m,Ae).call(this);i&&(s(this,d)!==r||F(this.options.enabled,s(this,d))!==F(n.enabled,s(this,d))||a!==s(this,Q))&&g(this,m,Fe).call(this,a)}getOptimisticResult(e){const n=s(this,E).getQueryCache().build(s(this,E),e),r=this.createResult(n,e);return jt(this,r)&&(o(this,D,r),o(this,ue,this.options),o(this,Z,s(this,d).state)),r}getCurrentResult(){return s(this,D)}trackResult(e,n){return new Proxy(e,{get:(r,i)=>(this.trackProp(i),n==null||n(i),i==="promise"&&(this.trackProp("data"),!this.options.experimental_prefetchInRender&&s(this,z).status==="pending"&&s(this,z).reject(new Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(r,i))})}trackProp(e){s(this,he).add(e)}getCurrentQuery(){return s(this,d)}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){const n=s(this,E).defaultQueryOptions(e),r=s(this,E).getQueryCache().build(s(this,E),n);return r.fetch().then(()=>this.createResult(r,n))}fetch(e){return g(this,m,de).call(this,{...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),s(this,D)))}createResult(e,n){var Le;const r=s(this,d),i=this.options,a=s(this,D),c=s(this,Z),u=s(this,ue),b=e!==r?e.state:s(this,me),{state:C}=e;let f={...C},S=!1,y;if(n._optimisticResults){const O=this.hasListeners(),ge=!O&&Ke(e,n),ne=O&&Ye(e,r,n,i);(ge||ne)&&(f={...f,...ct(C.data,e.options)}),n._optimisticResults==="isRestoring"&&(f.fetchStatus="idle")}let{error:_,errorUpdatedAt:P,status:v}=f;y=f.data;let w=!1;if(n.placeholderData!==void 0&&y===void 0&&v==="pending"){let O;a!=null&&a.isPlaceholderData&&n.placeholderData===(u==null?void 0:u.placeholderData)?(O=a.data,w=!0):O=typeof n.placeholderData=="function"?n.placeholderData((Le=s(this,le))==null?void 0:Le.state.data,s(this,le)):n.placeholderData,O!==void 0&&(v="success",y=Ee(a==null?void 0:a.data,O,n),S=!0)}if(n.select&&y!==void 0&&!w)if(a&&y===(c==null?void 0:c.data)&&n.select===s(this,ye))y=s(this,ce);else try{o(this,ye,n.select),y=n.select(y),y=Ee(a==null?void 0:a.data,y,n),o(this,ce,y),o(this,M,null)}catch(O){o(this,M,O)}s(this,M)&&(_=s(this,M),y=s(this,ce),P=Date.now(),v="error");const T=f.fetchStatus==="fetching",G=v==="pending",h=v==="error",x=G&&T,N=y!==void 0,j={status:v,fetchStatus:f.fetchStatus,isPending:G,isSuccess:v==="success",isError:h,isInitialLoading:x,isLoading:x,data:y,dataUpdatedAt:f.dataUpdatedAt,error:_,errorUpdatedAt:P,failureCount:f.fetchFailureCount,failureReason:f.fetchFailureReason,errorUpdateCount:f.errorUpdateCount,isFetched:f.dataUpdateCount>0||f.errorUpdateCount>0,isFetchedAfterMount:f.dataUpdateCount>b.dataUpdateCount||f.errorUpdateCount>b.errorUpdateCount,isFetching:T,isRefetching:T&&!G,isLoadingError:h&&!N,isPaused:f.fetchStatus==="paused",isPlaceholderData:S,isRefetchError:h&&N,isStale:ke(e,n),refetch:this.refetch,promise:s(this,z),isEnabled:F(n.enabled,e)!==!1};if(this.options.experimental_prefetchInRender){const O=ve=>{j.status==="error"?ve.reject(j.error):j.data!==void 0&&ve.resolve(j.data)},ge=()=>{const ve=o(this,z,j.promise=_e());O(ve)},ne=s(this,z);switch(ne.status){case"pending":e.queryHash===r.queryHash&&O(ne);break;case"fulfilled":(j.status==="error"||j.data!==ne.value)&&ge();break;case"rejected":(j.status!=="error"||j.error!==ne.reason)&&ge();break}}return j}updateResult(){const e=s(this,D),n=this.createResult(s(this,d),this.options);if(o(this,Z,s(this,d).state),o(this,ue,this.options),s(this,Z).data!==void 0&&o(this,le,s(this,d)),Ie(n,e))return;o(this,D,n);const r=()=>{if(!e)return!0;const{notifyOnChangeProps:i}=this.options,a=typeof i=="function"?i():i;if(a==="all"||!a&&!s(this,he).size)return!0;const c=new Set(a??s(this,he));return this.options.throwOnError&&c.add("error"),Object.keys(s(this,D)).some(u=>{const l=u;return s(this,D)[l]!==e[l]&&c.has(l)})};g(this,m,lt).call(this,{listeners:r()})}onQueryUpdate(){this.updateResult(),this.hasListeners()&&g(this,m,Ue).call(this)}},E=new WeakMap,d=new WeakMap,me=new WeakMap,D=new WeakMap,Z=new WeakMap,ue=new WeakMap,z=new WeakMap,M=new WeakMap,ye=new WeakMap,ce=new WeakMap,le=new WeakMap,X=new WeakMap,ee=new WeakMap,Q=new WeakMap,he=new WeakMap,m=new WeakSet,de=function(e){g(this,m,je).call(this);let n=s(this,d).fetch(this.options,e);return e!=null&&e.throwOnError||(n=n.catch(pe)),n},Oe=function(){g(this,m,qe).call(this);const e=se(this.options.staleTime,s(this,d));if(te||s(this,D).isStale||!Se(e))return;const r=st(s(this,D).dataUpdatedAt,e)+1;o(this,X,V.setTimeout(()=>{s(this,D).isStale||this.updateResult()},r))},Ae=function(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(s(this,d)):this.options.refetchInterval)??!1},Fe=function(e){g(this,m,Ge).call(this),o(this,Q,e),!(te||F(this.options.enabled,s(this,d))===!1||!Se(s(this,Q))||s(this,Q)===0)&&o(this,ee,V.setInterval(()=>{(this.options.refetchIntervalInBackground||at.isFocused())&&g(this,m,de).call(this)},s(this,Q)))},Ue=function(){g(this,m,Oe).call(this),g(this,m,Fe).call(this,g(this,m,Ae).call(this))},qe=function(){s(this,X)&&(V.clearTimeout(s(this,X)),o(this,X,void 0))},Ge=function(){s(this,ee)&&(V.clearInterval(s(this,ee)),o(this,ee,void 0))},je=function(){const e=s(this,E).getQueryCache().build(s(this,E),this.options);if(e===s(this,d))return;const n=s(this,d);o(this,d,e),o(this,me,e.state),this.hasListeners()&&(n==null||n.removeObserver(this),e.addObserver(this))},lt=function(e){$e.batch(()=>{e.listeners&&this.listeners.forEach(n=>{n(s(this,D))}),s(this,E).getQueryCache().notify({query:s(this,d),type:"observerResultsUpdated"})})},nt);function Gt(t,e){return F(e.enabled,t)!==!1&&t.state.data===void 0&&!(t.state.status==="error"&&e.retryOnMount===!1)}function Ke(t,e){return Gt(t,e)||t.state.data!==void 0&&xe(t,e,e.refetchOnMount)}function xe(t,e,n){if(F(e.enabled,t)!==!1&&se(e.staleTime,t)!=="static"){const r=typeof n=="function"?n(t):n;return r==="always"||r!==!1&&ke(t,e)}return!1}function Ye(t,e,n,r){return(t!==e||F(r.enabled,t)===!1)&&(!n.suspense||t.state.status!=="error")&&ke(t,n)}function ke(t,e){return F(e.enabled,t)!==!1&&t.isStaleByTime(se(e.staleTime,t))}function jt(t,e){return!Ie(t.getCurrentResult(),e)}var ht=U.createContext(void 0),xt=t=>{const e=U.useContext(ht);if(!e)throw new Error("No QueryClient set, use QueryClientProvider to set one");return e},En=({client:t,children:e})=>(U.useEffect(()=>(t.mount(),()=>{t.unmount()}),[t]),vt.jsx(ht.Provider,{value:t,children:e})),dt=U.createContext(!1),Bt=()=>U.useContext(dt);dt.Provider;function zt(){let t=!1;return{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t}}var Nt=U.createContext(zt()),$t=()=>U.useContext(Nt),kt=(t,e)=>{(t.suspense||t.throwOnError||t.experimental_prefetchInRender)&&(e.isReset()||(t.retryOnMount=!1))},Lt=t=>{U.useEffect(()=>{t.clearReset()},[t])},Mt=({result:t,errorResetBoundary:e,throwOnError:n,query:r,suspense:i})=>t.isError&&!e.isReset()&&!t.isFetching&&r&&(i&&t.data===void 0||Dt(n,[t.error,r])),Qt=t=>{if(t.suspense){const n=i=>i==="static"?i:Math.max(i??1e3,1e3),r=t.staleTime;t.staleTime=typeof r=="function"?(...i)=>n(r(...i)):n(r),typeof t.gcTime=="number"&&(t.gcTime=Math.max(t.gcTime,1e3))}},Vt=(t,e)=>t.isLoading&&t.isFetching&&!e,Wt=(t,e)=>(t==null?void 0:t.suspense)&&e.isPending,He=(t,e,n)=>e.fetchOptimistic(t).catch(()=>{n.clearReset()});function Kt(t,e,n){var f,S,y,_,P;const r=Bt(),i=$t(),a=xt(),c=a.defaultQueryOptions(t);(S=(f=a.getDefaultOptions().queries)==null?void 0:f._experimental_beforeQuery)==null||S.call(f,c),c._optimisticResults=r?"isRestoring":"optimistic",Qt(c),kt(c,i),Lt(i);const u=!a.getQueryCache().get(c.queryHash),[l]=U.useState(()=>new e(a,c)),b=l.getOptimisticResult(c),C=!r&&t.subscribed!==!1;if(U.useSyncExternalStore(U.useCallback(v=>{const w=C?l.subscribe($e.batchCalls(v)):pe;return l.updateResult(),w},[l,C]),()=>l.getCurrentResult(),()=>l.getCurrentResult()),U.useEffect(()=>{l.setOptions(c)},[c,l]),Wt(c,b))throw He(c,l,i);if(Mt({result:b,errorResetBoundary:i,throwOnError:c.throwOnError,query:a.getQueryCache().get(c.queryHash),suspense:c.suspense}))throw b.error;if((_=(y=a.getDefaultOptions().queries)==null?void 0:y._experimental_afterQuery)==null||_.call(y,c,b),c.experimental_prefetchInRender&&!te&&Vt(b,r)){const v=u?He(c,l,i):(P=a.getQueryCache().get(c.queryHash))==null?void 0:P.promise;v==null||v.catch(pe).finally(()=>{l.updateResult()})}return c.notifyOnChangeProps?b:l.trackResult(b)}function _n(t,e){return Kt(t,qt)}const pt={};var Ce={};const Yt="https://ly-budget-gql-prod-702918025200.asia-east1.run.app/api/graphql",Ht="https://ly-budget-gql-dev-702918025200.asia-east1.run.app/api/graphql",Jt=()=>typeof import.meta<"u"&&typeof pt<"u"?"https://ly-budget-gql-dev-702918025200.asia-east1.run.app/api/graphql":typeof process<"u"?Ce.VITE_GQL_ENDPOINT??Ce.GQL_ENDPOINT??Ce.GRAPHQL_ENDPOINT??null:null,Zt=()=>typeof import.meta<"u"&&typeof pt<"u"||typeof process<"u"?"production":null,Xt=Jt(),ft=Zt();console.log({mode:ft});const mt=Xt??(ft==="production"?Yt:Ht);console.log({GQL_ENDPOINTS:mt});const Tn="/";async function On(t,...[e]){const n=await fetch(mt,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/graphql-response+json"},body:JSON.stringify({query:t,variables:e})});if(!n.ok)throw new Error("Network response was not ok");return(await n.json()).data}var en=(t=>(t.Asc="asc",t.Desc="desc",t))(en||{}),tn=(t=>(t.Freeze="freeze",t.Other="other",t.Reduce="reduce",t))(tn||{});class I extends String{constructor(n,r){super(n);be(this,"__apiType");be(this,"value");be(this,"__meta__");this.value=n,this.__meta__=r}toString(){return this.value}}const An=new I(`
    fragment VisualizationProposalBase on Proposal {
  id
  freezeAmount
  reductionAmount
  proposalTypes
  proposers {
    id
    name
    party {
      name
      color
    }
  }
}
    `,{fragmentName:"VisualizationProposalBase"}),Fn=new I(`
    fragment VisualizationProposalWithContext on Proposal {
  ...VisualizationProposalBase
  government {
    name
    category
  }
  year {
    year
  }
}
    fragment VisualizationProposalBase on Proposal {
  id
  freezeAmount
  reductionAmount
  proposalTypes
  proposers {
    id
    name
    party {
      name
      color
    }
  }
}`,{fragmentName:"VisualizationProposalWithContext"}),nn=new I(`
    query GetLatestBudgetYear($skip: Int!, $take: Int!) {
  budgetYears(orderBy: [{year: desc}], skip: $skip, take: $take) {
    year
    budgetProgress
    dataProgress
    unfreezeProgress
  }
}
    `),sn=new I(`
    query GetBudgetYearsList {
  budgetYears(orderBy: [{year: desc}]) {
    id
    year
  }
}
    `),rn=new I(`
    query GetBudgetsWithGovernment {
  budgets {
    id
    type
    year
    projectName
    projectDescription
    budgetAmount
    majorCategory
    mediumCategory
    minorCategory
    description
    government {
      id
      name
      category
    }
  }
  budgetsCount
}
    `),an=new I(`
    query GetGovernments {
  governments {
    id
    name
    category
    description
  }
}
    `),on=new I(`
    query GetProposalGovernments($where: ProposalWhereInput!) {
  proposals(where: $where) {
    government {
      id
      name
      category
      description
    }
  }
}
    `),un=new I(`
    query GetPeopleList {
  peopleList(orderBy: [{name: asc}]) {
    id
    name
    type
    description
    party {
      id
      name
    }
  }
}
    `),cn=new I(`
    query RecognitionImages {
  recognitionImages(where: {verificationStatus: {equals: "verified"}}) {
    result
  }
  recognitionImagesCount
}
    `),ln=new I(`
    query People($where: PeopleWhereUniqueInput!) {
  people(where: $where) {
    id
    name
    description
    party {
      id
      color
      name
    }
    term {
      termNumber
      id
    }
    termCount
    committees {
      id
      name
      session
      term {
        id
        startDate
        termNumber
      }
    }
  }
}
    `),hn=new I(`
    query GetProposalsOrderedByIdDesc {
  proposals(orderBy: [{id: desc}]) {
    id
    description
    reason
    publishStatus
    result
    freezeAmount
    reductionAmount
    cost
    budgetImageUrl
    proposalTypes
    recognitionAnswer
    unfreezeStatus
    government {
      id
      name
      category
      description
    }
    budget {
      id
      projectName
      budgetAmount
      year
      type
      majorCategory
      mediumCategory
      minorCategory
    }
    proposers {
      id
      name
      type
      description
    }
    coSigners {
      id
      name
      type
    }
  }
  proposalsCount
}
    `),dn=new I(`
    query GetProposalById($id: ID!) {
  proposal(where: {id: $id}) {
    id
    description
    reason
    publishStatus
    result
    freezeAmount
    reductionAmount
    cost
    budgetImageUrls
    budgetImageUrl
    proposalTypes
    recognitionAnswer
    unfreezeStatus
    unfreezeReport
    react_angry
    react_disappoint
    react_good
    react_whatever
    historicalParentProposals {
      id
    }
    mergedParentProposals {
      id
      proposers {
        id
        name
      }
    }
    historicalProposals {
      id
    }
    government {
      id
      name
      category
      description
    }
    budget {
      id
      projectName
      projectDescription
      budgetAmount
      budgetUrl
      lastYearSettlement
      year
      type
      majorCategory
      mediumCategory
      minorCategory
      description
    }
    proposers {
      id
      name
      type
      description
    }
    coSigners {
      id
      name
      type
    }
    meetings(orderBy: [{meetingDate: desc}]) {
      id
      displayName
      meetingDate
      description
      location
      meetingRecordUrl
      type
      committee {
        displayName
        name
        endDate
        startDate
      }
    }
    unfreezeHistory {
      id
      displayName
      meetingDate
      description
      location
      meetingRecordUrl
      type
      committee {
        displayName
        name
        endDate
        startDate
      }
    }
    mergedProposals {
      id
      proposers {
        id
        name
      }
    }
    historicalProposals {
      id
      meetings {
        id
      }
      proposers {
        id
        name
      }
    }
  }
}
    `),pn=new I(`
    query GetProposalYears {
  budgetYears(orderBy: [{year: desc}]) {
    id
    year
    budgetProgress
    dataProgress
    unfreezeProgress
  }
}
    `),fn=new I(`
    query GetPaginatedProposals($skip: Int!, $take: Int!, $orderBy: [ProposalOrderByInput!]!, $where: ProposalWhereInput!) {
  proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {
    id
    description
    year {
      id
      year
    }
    unfreezeStatus
    meetings {
      id
      type
      meetingDate
      committee {
        displayName
        name
        endDate
        startDate
      }
    }
    reason
    result
    freezeAmount
    reductionAmount
    cost
    proposalTypes
    react_angry
    react_disappoint
    react_good
    react_whatever
    government {
      id
      name
    }
    budget {
      id
      budgetAmount
    }
    proposers {
      id
      name
    }
  }
  proposalsCount(where: $where)
}
    `),mn=new I(`
    mutation UPDATE_PROPOSAL_REACTS($where: ProposalWhereUniqueInput!, $data: ProposalUpdateInput!) {
  updateProposal(where: $where, data: $data) {
    id
    react_angry
    react_disappoint
    react_good
    react_whatever
  }
}
    `),yn=new I(`
    query GetVisualizationProposals($where: ProposalWhereInput!) {
  proposals(where: $where) {
    ...VisualizationProposalWithContext
  }
}
    fragment VisualizationProposalWithContext on Proposal {
  ...VisualizationProposalBase
  government {
    name
    category
  }
  year {
    year
  }
}
fragment VisualizationProposalBase on Proposal {
  id
  freezeAmount
  reductionAmount
  proposalTypes
  proposers {
    id
    name
    party {
      name
      color
    }
  }
}`),gn={"\n  query GetLatestBudgetYear($skip: Int!, $take: Int!) {\n    budgetYears(orderBy: [{ year: desc }], skip: $skip, take: $take) {\n      year\n      budgetProgress\n      dataProgress\n      unfreezeProgress\n    }\n  }\n":nn,"\n  query GetBudgetYearsList {\n    budgetYears(orderBy: [{ year: desc }]) {\n      id\n      year\n    }\n  }\n":sn,"\n  query GetBudgetsWithGovernment {\n    budgets {\n      id\n      type\n      year\n      projectName\n      projectDescription\n      budgetAmount\n      majorCategory\n      mediumCategory\n      minorCategory\n      description\n      government {\n        id\n        name\n        category\n      }\n    }\n    budgetsCount\n  }\n":rn,"\n  query GetGovernments {\n    governments {\n      id\n      name\n      category\n      description\n    }\n  }\n":an,"\n  query GetProposalGovernments($where: ProposalWhereInput!) {\n    proposals(where: $where) {\n      government {\n        id\n        name\n        category\n        description\n      }\n    }\n  }\n":on,"\n  query GetPeopleList {\n    peopleList(orderBy: [{ name: asc }]) {\n      id\n      name\n      type\n      description\n      party {\n        id\n        name\n      }\n    }\n  }\n":un,'\n  query RecognitionImages {\n    recognitionImages(where: { verificationStatus: { equals: "verified" } }) {\n      result\n    }\n    recognitionImagesCount\n  }\n':cn,"\n  query People($where: PeopleWhereUniqueInput!) {\n    people(where: $where) {\n      id\n      name\n      description\n      party {\n        id\n        color\n        name\n      }\n      term {\n        termNumber\n        id\n      }\n      termCount\n      committees {\n        id\n        name\n        session\n        term {\n          id\n          startDate\n          termNumber\n        }\n      }\n    }\n  }\n":ln,"\n  query GetProposalsOrderedByIdDesc {\n    proposals(orderBy: [{ id: desc }]) {\n      id\n      description\n      reason\n      publishStatus\n      result\n      freezeAmount\n      reductionAmount\n      cost\n      budgetImageUrl\n      proposalTypes\n      recognitionAnswer\n      unfreezeStatus\n      government {\n        id\n        name\n        category\n        description\n      }\n      budget {\n        id\n        projectName\n        budgetAmount\n        year\n        type\n        majorCategory\n        mediumCategory\n        minorCategory\n      }\n      proposers {\n        id\n        name\n        type\n        description\n      }\n      coSigners {\n        id\n        name\n        type\n      }\n    }\n    proposalsCount\n  }\n":hn,"\n  query GetProposalById($id: ID!) {\n    proposal(where: { id: $id }) {\n      id\n      description\n      reason\n      publishStatus\n      result\n      freezeAmount\n      reductionAmount\n      cost\n      budgetImageUrls\n      budgetImageUrl\n      proposalTypes\n      recognitionAnswer\n      unfreezeStatus\n      unfreezeReport\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n      historicalParentProposals {\n        id\n      }\n      mergedParentProposals {\n        id\n        proposers {\n          id\n          name\n        }\n      }\n      historicalProposals {\n        id\n      }\n      government {\n        id\n        name\n        category\n        description\n      }\n      budget {\n        id\n        projectName\n        projectDescription\n        budgetAmount\n        budgetUrl\n        lastYearSettlement\n        year\n        type\n        majorCategory\n        mediumCategory\n        minorCategory\n        description\n      }\n      proposers {\n        id\n        name\n        type\n        description\n      }\n      coSigners {\n        id\n        name\n        type\n      }\n      meetings(orderBy: [{ meetingDate: desc }]) {\n        id\n        displayName\n        meetingDate\n        description\n        location\n        meetingRecordUrl\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      unfreezeHistory {\n        id\n        displayName\n        meetingDate\n        description\n        location\n        meetingRecordUrl\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      mergedProposals {\n        id\n        proposers {\n          id\n          name\n        }\n      }\n      historicalProposals {\n        id\n        meetings {\n          id\n        }\n        proposers {\n          id\n          name\n        }\n      }\n    }\n  }\n":dn,"\n  query GetProposalYears {\n    budgetYears(orderBy: [{ year: desc }]) {\n      id\n      year\n      budgetProgress\n      dataProgress\n      unfreezeProgress\n    }\n  }\n":pn,"\n  query GetPaginatedProposals(\n    $skip: Int!\n    $take: Int!\n    $orderBy: [ProposalOrderByInput!]!\n    $where: ProposalWhereInput!\n  ) {\n    proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {\n      id\n      description\n      year {\n        id\n        year\n      }\n      unfreezeStatus\n      meetings {\n        id\n        type\n        meetingDate\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      reason\n      result\n      freezeAmount\n      reductionAmount\n      cost\n      proposalTypes\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n      government {\n        id\n        name\n      }\n      budget {\n        id\n        budgetAmount\n      }\n      proposers {\n        id\n        name\n      }\n    }\n    proposalsCount(where: $where)\n  }\n":fn,"\n  mutation UPDATE_PROPOSAL_REACTS(\n    $where: ProposalWhereUniqueInput!\n    $data: ProposalUpdateInput!\n  ) {\n    updateProposal(where: $where, data: $data) {\n      id\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n    }\n  }\n":mn,"\n  query GetVisualizationProposals($where: ProposalWhereInput!) {\n    proposals(where: $where) {\n      ...VisualizationProposalWithContext\n    }\n  }\n\n  fragment VisualizationProposalWithContext on Proposal {\n    ...VisualizationProposalBase\n    government {\n      name\n      category\n    }\n    year {\n      year\n    }\n  }\n\n  fragment VisualizationProposalBase on Proposal {\n    id\n    freezeAmount\n    reductionAmount\n    proposalTypes\n    proposers {\n      id\n      name\n      party {\n        name\n        color\n      }\n    }\n  }\n":yn};function Un(t){return gn[t]??{}}export{Tn as E,mt as G,en as O,tn as P,Dn as Q,Ut as R,ze as S,Fn as V,In as a,Rn as b,pe as c,wn as d,It as e,at as f,Pn as g,Ct as h,Re as i,On as j,En as k,Sn as l,Cn as m,$e as n,ot as o,Ne as p,An as q,se as r,it as s,Un as t,_n as u,Ie as v,xt as w,Dt as x,Ft as y};
