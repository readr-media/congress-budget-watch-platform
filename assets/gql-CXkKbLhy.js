var Te=Object.defineProperty;var fe=t=>{throw TypeError(t)};var ze=(t,e,n)=>e in t?Te(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var Y=(t,e,n)=>ze(t,typeof e!="symbol"?e+"":e,n),Z=(t,e,n)=>e.has(t)||fe("Cannot "+n);var r=(t,e,n)=>(Z(t,e,"read from private field"),n?n.call(t):e.get(t)),m=(t,e,n)=>e.has(t)?fe("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,n),d=(t,e,n,s)=>(Z(t,e,"write to private field"),s?s.call(t,n):e.set(t,n),n),p=(t,e,n)=>(Z(t,e,"access private method"),n);import{S as Ae,q as ye,t as _,u as te,r as M,d as ne,v as re,w as Pe,x as Be,y as H,g as Ne,z as $e,A as be,n as Re,B as Ce,C as Ue}from"./QueryClientProvider-CzuGl5xs.js";import{a as S}from"./chunk-EPOLDU6W-BUbbWhPN.js";var y,o,V,f,z,U,C,D,j,G,x,A,B,E,k,a,L,se,oe,ae,ie,ue,ce,de,Se,Ie,Ge=(Ie=class extends Ae{constructor(e,n){super();m(this,a);m(this,y);m(this,o);m(this,V);m(this,f);m(this,z);m(this,U);m(this,C);m(this,D);m(this,j);m(this,G);m(this,x);m(this,A);m(this,B);m(this,E);m(this,k,new Set);this.options=n,d(this,y,e),d(this,D,null),d(this,C,ye()),this.bindMethods(),this.setOptions(n)}bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(r(this,o).addObserver(this),ve(r(this,o),this.options)?p(this,a,L).call(this):this.updateResult(),p(this,a,ie).call(this))}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return pe(r(this,o),this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return pe(r(this,o),this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,p(this,a,ue).call(this),p(this,a,ce).call(this),r(this,o).removeObserver(this)}setOptions(e){const n=this.options,s=r(this,o);if(this.options=r(this,y).defaultQueryOptions(e),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof _(this.options.enabled,r(this,o))!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");p(this,a,de).call(this),r(this,o).setOptions(this.options),n._defaulted&&!te(this.options,n)&&r(this,y).getQueryCache().notify({type:"observerOptionsUpdated",query:r(this,o),observer:this});const i=this.hasListeners();i&&we(r(this,o),s,this.options,n)&&p(this,a,L).call(this),this.updateResult(),i&&(r(this,o)!==s||_(this.options.enabled,r(this,o))!==_(n.enabled,r(this,o))||M(this.options.staleTime,r(this,o))!==M(n.staleTime,r(this,o)))&&p(this,a,se).call(this);const u=p(this,a,oe).call(this);i&&(r(this,o)!==s||_(this.options.enabled,r(this,o))!==_(n.enabled,r(this,o))||u!==r(this,E))&&p(this,a,ae).call(this,u)}getOptimisticResult(e){const n=r(this,y).getQueryCache().build(r(this,y),e),s=this.createResult(n,e);return ke(this,s)&&(d(this,f,s),d(this,U,this.options),d(this,z,r(this,o).state)),s}getCurrentResult(){return r(this,f)}trackResult(e,n){return new Proxy(e,{get:(s,i)=>(this.trackProp(i),n==null||n(i),i==="promise"&&(this.trackProp("data"),!this.options.experimental_prefetchInRender&&r(this,C).status==="pending"&&r(this,C).reject(new Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(s,i))})}trackProp(e){r(this,k).add(e)}getCurrentQuery(){return r(this,o)}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){const n=r(this,y).defaultQueryOptions(e),s=r(this,y).getQueryCache().build(r(this,y),n);return s.fetch().then(()=>this.createResult(s,n))}fetch(e){return p(this,a,L).call(this,{...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),r(this,f)))}createResult(e,n){var ge;const s=r(this,o),i=this.options,u=r(this,f),c=r(this,z),w=r(this,U),g=e!==s?e.state:r(this,V),{state:I}=e;let l={...I},O=!1,h;if(n._optimisticResults){const v=this.hasListeners(),F=!v&&ve(e,n),$=v&&we(e,s,n,i);(F||$)&&(l={...l,...$e(I.data,e.options)}),n._optimisticResults==="isRestoring"&&(l.fetchStatus="idle")}let{error:T,errorUpdatedAt:Q,status:b}=l;h=l.data;let q=!1;if(n.placeholderData!==void 0&&h===void 0&&b==="pending"){let v;u!=null&&u.isPlaceholderData&&n.placeholderData===(w==null?void 0:w.placeholderData)?(v=u.data,q=!0):v=typeof n.placeholderData=="function"?n.placeholderData((ge=r(this,x))==null?void 0:ge.state.data,r(this,x)):n.placeholderData,v!==void 0&&(b="success",h=be(u==null?void 0:u.data,v,n),O=!0)}if(n.select&&h!==void 0&&!q)if(u&&h===(c==null?void 0:c.data)&&n.select===r(this,j))h=r(this,G);else try{d(this,j,n.select),h=n.select(h),h=be(u==null?void 0:u.data,h,n),d(this,G,h),d(this,D,null)}catch(v){d(this,D,v)}r(this,D)&&(T=r(this,D),h=r(this,G),Q=Date.now(),b="error");const J=l.fetchStatus==="fetching",K=b==="pending",X=b==="error",he=K&&J,me=h!==void 0,R={status:b,fetchStatus:l.fetchStatus,isPending:K,isSuccess:b==="success",isError:X,isInitialLoading:he,isLoading:he,data:h,dataUpdatedAt:l.dataUpdatedAt,error:T,errorUpdatedAt:Q,failureCount:l.fetchFailureCount,failureReason:l.fetchFailureReason,errorUpdateCount:l.errorUpdateCount,isFetched:l.dataUpdateCount>0||l.errorUpdateCount>0,isFetchedAfterMount:l.dataUpdateCount>g.dataUpdateCount||l.errorUpdateCount>g.errorUpdateCount,isFetching:J,isRefetching:J&&!K,isLoadingError:X&&!me,isPaused:l.fetchStatus==="paused",isPlaceholderData:O,isRefetchError:X&&me,isStale:le(e,n),refetch:this.refetch,promise:r(this,C),isEnabled:_(n.enabled,e)!==!1};if(this.options.experimental_prefetchInRender){const v=W=>{R.status==="error"?W.reject(R.error):R.data!==void 0&&W.resolve(R.data)},F=()=>{const W=d(this,C,R.promise=ye());v(W)},$=r(this,C);switch($.status){case"pending":e.queryHash===s.queryHash&&v($);break;case"fulfilled":(R.status==="error"||R.data!==$.value)&&F();break;case"rejected":(R.status!=="error"||R.error!==$.reason)&&F();break}}return R}updateResult(){const e=r(this,f),n=this.createResult(r(this,o),this.options);if(d(this,z,r(this,o).state),d(this,U,this.options),r(this,z).data!==void 0&&d(this,x,r(this,o)),te(n,e))return;d(this,f,n);const s=()=>{if(!e)return!0;const{notifyOnChangeProps:i}=this.options,u=typeof i=="function"?i():i;if(u==="all"||!u&&!r(this,k).size)return!0;const c=new Set(u??r(this,k));return this.options.throwOnError&&c.add("error"),Object.keys(r(this,f)).some(w=>{const N=w;return r(this,f)[N]!==e[N]&&c.has(N)})};p(this,a,Se).call(this,{listeners:s()})}onQueryUpdate(){this.updateResult(),this.hasListeners()&&p(this,a,ie).call(this)}},y=new WeakMap,o=new WeakMap,V=new WeakMap,f=new WeakMap,z=new WeakMap,U=new WeakMap,C=new WeakMap,D=new WeakMap,j=new WeakMap,G=new WeakMap,x=new WeakMap,A=new WeakMap,B=new WeakMap,E=new WeakMap,k=new WeakMap,a=new WeakSet,L=function(e){p(this,a,de).call(this);let n=r(this,o).fetch(this.options,e);return e!=null&&e.throwOnError||(n=n.catch(ne)),n},se=function(){p(this,a,ue).call(this);const e=M(this.options.staleTime,r(this,o));if(re||r(this,f).isStale||!Pe(e))return;const s=Be(r(this,f).dataUpdatedAt,e)+1;d(this,A,H.setTimeout(()=>{r(this,f).isStale||this.updateResult()},s))},oe=function(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(r(this,o)):this.options.refetchInterval)??!1},ae=function(e){p(this,a,ce).call(this),d(this,E,e),!(re||_(this.options.enabled,r(this,o))===!1||!Pe(r(this,E))||r(this,E)===0)&&d(this,B,H.setInterval(()=>{(this.options.refetchIntervalInBackground||Ne.isFocused())&&p(this,a,L).call(this)},r(this,E)))},ie=function(){p(this,a,se).call(this),p(this,a,ae).call(this,p(this,a,oe).call(this))},ue=function(){r(this,A)&&(H.clearTimeout(r(this,A)),d(this,A,void 0))},ce=function(){r(this,B)&&(H.clearInterval(r(this,B)),d(this,B,void 0))},de=function(){const e=r(this,y).getQueryCache().build(r(this,y),this.options);if(e===r(this,o))return;const n=r(this,o);d(this,o,e),d(this,V,e.state),this.hasListeners()&&(n==null||n.removeObserver(this),e.addObserver(this))},Se=function(e){Re.batch(()=>{e.listeners&&this.listeners.forEach(n=>{n(r(this,f))}),r(this,y).getQueryCache().notify({query:r(this,o),type:"observerResultsUpdated"})})},Ie);function xe(t,e){return _(e.enabled,t)!==!1&&t.state.data===void 0&&!(t.state.status==="error"&&e.retryOnMount===!1)}function ve(t,e){return xe(t,e)||t.state.data!==void 0&&pe(t,e,e.refetchOnMount)}function pe(t,e,n){if(_(e.enabled,t)!==!1&&M(e.staleTime,t)!=="static"){const s=typeof n=="function"?n(t):n;return s==="always"||s!==!1&&le(t,e)}return!1}function we(t,e,n,s){return(t!==e||_(s.enabled,t)===!1)&&(!n.suspense||t.state.status!=="error")&&le(t,n)}function le(t,e){return _(e.enabled,t)!==!1&&t.isStaleByTime(M(e.staleTime,t))}function ke(t,e){return!te(t.getCurrentResult(),e)}var De=S.createContext(!1),Qe=()=>S.useContext(De);De.Provider;function Le(){let t=!1;return{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t}}var Me=S.createContext(Le()),Ve=()=>S.useContext(Me),je=(t,e,n)=>{const s=n!=null&&n.state.error&&typeof t.throwOnError=="function"?Ce(t.throwOnError,[n.state.error,n]):t.throwOnError;(t.suspense||t.experimental_prefetchInRender||s)&&(e.isReset()||(t.retryOnMount=!1))},qe=t=>{S.useEffect(()=>{t.clearReset()},[t])},Fe=({result:t,errorResetBoundary:e,throwOnError:n,query:s,suspense:i})=>t.isError&&!e.isReset()&&!t.isFetching&&s&&(i&&t.data===void 0||Ce(n,[t.error,s])),We=t=>{if(t.suspense){const n=i=>i==="static"?i:Math.max(i??1e3,1e3),s=t.staleTime;t.staleTime=typeof s=="function"?(...i)=>n(s(...i)):n(s),typeof t.gcTime=="number"&&(t.gcTime=Math.max(t.gcTime,1e3))}},Ye=(t,e)=>t.isLoading&&t.isFetching&&!e,He=(t,e)=>(t==null?void 0:t.suspense)&&e.isPending,_e=(t,e,n)=>e.fetchOptimistic(t).catch(()=>{n.clearReset()});function Je(t,e,n){var O,h,T,Q;const s=Qe(),i=Ve(),u=Ue(),c=u.defaultQueryOptions(t);(h=(O=u.getDefaultOptions().queries)==null?void 0:O._experimental_beforeQuery)==null||h.call(O,c);const w=u.getQueryCache().get(c.queryHash);c._optimisticResults=s?"isRestoring":"optimistic",We(c),je(c,i,w),qe(i);const N=!u.getQueryCache().get(c.queryHash),[g]=S.useState(()=>new e(u,c)),I=g.getOptimisticResult(c),l=!s&&t.subscribed!==!1;if(S.useSyncExternalStore(S.useCallback(b=>{const q=l?g.subscribe(Re.batchCalls(b)):ne;return g.updateResult(),q},[g,l]),()=>g.getCurrentResult(),()=>g.getCurrentResult()),S.useEffect(()=>{g.setOptions(c)},[c,g]),He(c,I))throw _e(c,g,i);if(Fe({result:I,errorResetBoundary:i,throwOnError:c.throwOnError,query:w,suspense:c.suspense}))throw I.error;if((Q=(T=u.getDefaultOptions().queries)==null?void 0:T._experimental_afterQuery)==null||Q.call(T,c,I),c.experimental_prefetchInRender&&!re&&Ye(I,s)){const b=N?_e(c,g,i):w==null?void 0:w.promise;b==null||b.catch(ne).finally(()=>{g.updateResult()})}return c.notifyOnChangeProps?I:g.trackResult(I)}function _t(t,e){return Je(t,Ge)}const Ke={};var ee={};const Xe="https://ly-budget-gql-prod-702918025200.asia-east1.run.app/api/graphql",Ze="https://ly-budget-gql-dev-702918025200.asia-east1.run.app/api/graphql",et=()=>typeof process<"u"?ee.VITE_GQL_ENDPOINT??ee.GQL_ENDPOINT??ee.GRAPHQL_ENDPOINT??null:null,tt=()=>typeof import.meta<"u"&&typeof Ke<"u"||typeof process<"u"?"production":null,nt=et(),Ee=tt();console.log({mode:Ee});const Oe=nt??(Ee==="production"?Xe:Ze);console.log({GQL_ENDPOINTS:Oe});const It="/";async function Rt(t,...[e]){const n=await fetch(Oe,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/graphql-response+json"},body:JSON.stringify({query:t,variables:e})});if(!n.ok)throw new Error("Network response was not ok");return(await n.json()).data}var rt=(t=>(t.Asc="asc",t.Desc="desc",t))(rt||{}),st=(t=>(t.Freeze="freeze",t.Other="other",t.Reduce="reduce",t))(st||{});class P extends String{constructor(n,s){super(n);Y(this,"__apiType");Y(this,"value");Y(this,"__meta__");this.value=n,this.__meta__=s}toString(){return this.value}}const Ct=new P(`
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
    `,{fragmentName:"VisualizationProposalBase"}),St=new P(`
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
}`,{fragmentName:"VisualizationProposalWithContext"}),ot=new P(`
    query GetLatestBudgetYear($skip: Int!, $take: Int!) {
  budgetYears(orderBy: [{year: desc}], skip: $skip, take: $take) {
    year
    budgetProgress
    dataProgress
    unfreezeProgress
  }
}
    `),at=new P(`
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
    `),it=new P(`
    query GetGovernments {
  governments {
    id
    name
    category
    description
  }
}
    `),ut=new P(`
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
    `),ct=new P(`
    query RecognitionImages {
  recognitionImages(where: {verificationStatus: {equals: "verified"}}) {
    result
  }
  recognitionImagesCount
}
    `),dt=new P(`
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
    `),pt=new P(`
    query GetProposalsOrderedByIdDesc {
  proposals(orderBy: [{id: desc}]) {
    id
    description
    reason
    publishStatus
    result
    freezeAmount
    reductionAmount
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
    `),lt=new P(`
    query GetProposalById($id: ID!) {
  proposal(where: {id: $id}) {
    id
    description
    reason
    publishStatus
    result
    freezeAmount
    reductionAmount
    budgetImageUrl
    proposalTypes
    recognitionAnswer
    unfreezeStatus
    unfreezeReport
    react_angry
    react_disappoint
    react_good
    react_whatever
    budgetImageUrl
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
    `),ht=new P(`
    query GetProposalYears {
  budgetYears(orderBy: [{year: desc}]) {
    id
    year
    budgetProgress
    dataProgress
    unfreezeProgress
  }
}
    `),mt=new P(`
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
    `),gt=new P(`
    mutation UPDATE_PROPOSAL_REACTS($where: ProposalWhereUniqueInput!, $data: ProposalUpdateInput!) {
  updateProposal(where: $where, data: $data) {
    id
    react_angry
    react_disappoint
    react_good
    react_whatever
  }
}
    `),ft=new P(`
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
}`),yt={"\n  query GetLatestBudgetYear($skip: Int!, $take: Int!) {\n    budgetYears(orderBy: [{ year: desc }], skip: $skip, take: $take) {\n      year\n      budgetProgress\n      dataProgress\n      unfreezeProgress\n    }\n  }\n":ot,"\n  query GetBudgetsWithGovernment {\n    budgets {\n      id\n      type\n      year\n      projectName\n      projectDescription\n      budgetAmount\n      majorCategory\n      mediumCategory\n      minorCategory\n      description\n      government {\n        id\n        name\n        category\n      }\n    }\n    budgetsCount\n  }\n":at,"\n  query GetGovernments {\n    governments {\n      id\n      name\n      category\n      description\n    }\n  }\n":it,"\n  query GetPeopleList {\n    peopleList(orderBy: [{ name: asc }]) {\n      id\n      name\n      type\n      description\n      party {\n        id\n        name\n      }\n    }\n  }\n":ut,'\n  query RecognitionImages {\n    recognitionImages(where: { verificationStatus: { equals: "verified" } }) {\n      result\n    }\n    recognitionImagesCount\n  }\n':ct,"\n  query People($where: PeopleWhereUniqueInput!) {\n    people(where: $where) {\n      id\n      name\n      description\n      party {\n        id\n        color\n        name\n      }\n      term {\n        termNumber\n        id\n      }\n      termCount\n      committees {\n        id\n        name\n        session\n        term {\n          id\n          startDate\n          termNumber\n        }\n      }\n    }\n  }\n":dt,"\n  query GetProposalsOrderedByIdDesc {\n    proposals(orderBy: [{ id: desc }]) {\n      id\n      description\n      reason\n      publishStatus\n      result\n      freezeAmount\n      reductionAmount\n      budgetImageUrl\n      proposalTypes\n      recognitionAnswer\n      unfreezeStatus\n      government {\n        id\n        name\n        category\n        description\n      }\n      budget {\n        id\n        projectName\n        budgetAmount\n        year\n        type\n        majorCategory\n        mediumCategory\n        minorCategory\n      }\n      proposers {\n        id\n        name\n        type\n        description\n      }\n      coSigners {\n        id\n        name\n        type\n      }\n    }\n    proposalsCount\n  }\n":pt,"\n  query GetProposalById($id: ID!) {\n    proposal(where: { id: $id }) {\n      id\n      description\n      reason\n      publishStatus\n      result\n      freezeAmount\n      reductionAmount\n      budgetImageUrl\n      proposalTypes\n      recognitionAnswer\n      unfreezeStatus\n      unfreezeReport\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n      budgetImageUrl\n      historicalParentProposals {\n        id\n      }\n      mergedParentProposals {\n        id\n        proposers {\n          id\n          name\n        }\n      }\n      historicalProposals {\n        id\n      }\n      government {\n        id\n        name\n        category\n        description\n      }\n      budget {\n        id\n        projectName\n        projectDescription\n        budgetAmount\n        budgetUrl\n        lastYearSettlement\n        year\n        type\n        majorCategory\n        mediumCategory\n        minorCategory\n        description\n      }\n      proposers {\n        id\n        name\n        type\n        description\n      }\n      coSigners {\n        id\n        name\n        type\n      }\n      meetings(orderBy: [{ meetingDate: desc }]) {\n        id\n        displayName\n        meetingDate\n        description\n        location\n        meetingRecordUrl\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      unfreezeHistory {\n        id\n        displayName\n        meetingDate\n        description\n        location\n        meetingRecordUrl\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      mergedProposals {\n        id\n        proposers {\n          id\n          name\n        }\n      }\n      historicalProposals {\n        id\n        meetings {\n          id\n        }\n        proposers {\n          id\n          name\n        }\n      }\n    }\n  }\n":lt,"\n  query GetProposalYears {\n    budgetYears(orderBy: [{ year: desc }]) {\n      id\n      year\n      budgetProgress\n      dataProgress\n      unfreezeProgress\n    }\n  }\n":ht,"\n  query GetPaginatedProposals(\n    $skip: Int!\n    $take: Int!\n    $orderBy: [ProposalOrderByInput!]!\n    $where: ProposalWhereInput!\n  ) {\n    proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {\n      id\n      description\n      year {\n        id\n        year\n      }\n      unfreezeStatus\n      meetings {\n        id\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      reason\n      result\n      freezeAmount\n      reductionAmount\n      proposalTypes\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n      government {\n        id\n        name\n      }\n      budget {\n        id\n        budgetAmount\n      }\n      proposers {\n        id\n        name\n      }\n    }\n    proposalsCount(where: $where)\n  }\n":mt,"\n  mutation UPDATE_PROPOSAL_REACTS(\n    $where: ProposalWhereUniqueInput!\n    $data: ProposalUpdateInput!\n  ) {\n    updateProposal(where: $where, data: $data) {\n      id\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n    }\n  }\n":gt,"\n  query GetVisualizationProposals($where: ProposalWhereInput!) {\n    proposals(where: $where) {\n      ...VisualizationProposalWithContext\n    }\n  }\n\n  fragment VisualizationProposalWithContext on Proposal {\n    ...VisualizationProposalBase\n    government {\n      name\n      category\n    }\n    year {\n      year\n    }\n  }\n\n  fragment VisualizationProposalBase on Proposal {\n    id\n    freezeAmount\n    reductionAmount\n    proposalTypes\n    proposers {\n      id\n      name\n      party {\n        name\n        color\n      }\n    }\n  }\n":ft};function Dt(t){return yt[t]??{}}export{It as E,rt as O,st as P,St as V,Ct as a,Rt as e,Dt as g,_t as u};
