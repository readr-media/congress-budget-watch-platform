import{p as d}from"./chunk-OIYGIGL5-CVJ-uJPG.js";import{t as r}from"./gql-D5ADyGcE.js";const m="/congress-budget-watch-platform/".replace(/\/$/,""),u=`${m}/`,P=500,y=/^([a-z][a-z\d+\-.]*:)?\/\//i,_=({src:e,...s})=>{const o=y.test(e)?e:`${u}${e.startsWith("/")?e.slice(1):e}`;return d.jsx("img",{src:o,...s})};r(`
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
`);r(`
  query GetGovernments {
    governments {
      id
      name
      category
      description
    }
  }
`);const A=r(`
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
`),a={all:["governments"],lists:()=>[...a.all,"list"],list:e=>[...a.lists(),{filters:e}],proposalLists:()=>[...a.all,"proposal-list"],proposalList:e=>[...a.proposalLists(),{filters:e}]},E=r(`
  query GetPeopleList {
    peopleList(orderBy: [{ name: asc }]) {
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
`),p={all:["people"],lists:()=>[...p.all,"list"],list:e=>[...p.lists(),{filters:e}]};r(`
  query GetProposalsOrderedByIdDesc {
    proposals(orderBy: [{ id: desc }]) {
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
`);const h=r(`
  query GetProposalById($id: ID!) {
    proposal(where: { id: $id }) {
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
      meetings(orderBy: [{ meetingDate: desc }]) {
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
`),S=r(`
  query GetProposalYears {
    budgetYears(orderBy: [{ year: desc }]) {
      id
      year
      budgetProgress
      dataProgress
      unfreezeProgress
    }
  }
`),t={all:["proposals"],lists:()=>[...t.all,"list"],list:e=>[...t.lists(),{filters:e}],paginated:(e,s)=>[...t.lists(),"paginated",{where:e,year:s}],details:()=>[...t.all,"detail"],detail:e=>[...t.details(),e],years:()=>[...t.all,"years"]},T={all:["proposals"],lists:()=>[...t.all,"list"],list:e=>[...t.lists(),{filters:e}],paginated:(e,s,n,o,l)=>[...t.lists(),"paginated",{page:e,pageSize:s,sort:n,where:o,year:l}],details:()=>[...t.all,"detail"],detail:e=>[...t.details(),e],years:()=>[...t.all,"years"]},R=r(`
  query GetPaginatedProposals(
    $skip: Int!
    $take: Int!
    $orderBy: [ProposalOrderByInput!]!
    $where: ProposalWhereInput!
  ) {
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
`),b=r(`
  mutation UPDATE_PROPOSAL_REACTS(
    $where: ProposalWhereUniqueInput!
    $data: ProposalUpdateInput!
  ) {
    updateProposal(where: $where, data: $data) {
      id
      react_angry
      react_disappoint
      react_good
      react_whatever
    }
  }
`),G=r(`
  query GetLatestBudgetYear($skip: Int!, $take: Int!) {
    budgetYears(orderBy: [{ year: desc }], skip: $skip, take: $take) {
      year
      budgetProgress
      dataProgress
      unfreezeProgress
    }
  }
`),I=r(`
  query GetBudgetYearsList {
    budgetYears(orderBy: [{ year: desc }]) {
      id
      year
    }
  }
`),i={all:["budgetYear"],list:(e=0,s=1)=>[...i.all,"list",{skip:e,take:s}],latest:()=>[...i.all,"latest"],years:()=>[...i.all,"years"]},$=r(`
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
  }
`);export{I as G,_ as I,u as S,b as U,G as a,i as b,R as c,P as d,S as e,T as f,$ as g,h,a as i,A as j,p as k,E as l,t as p};
