import{p as l}from"./chunk-WWGJGFF6-C1k8rglg.js";import{t as a}from"./gql-CryelyAX.js";const m="/congress-budget-watch-platform/".replace(/\/$/,""),u=`${m}/`,P=500,c=/^([a-z][a-z\d+\-.]*:)?\/\//i,_=({src:e,...r})=>{const s=c.test(e)?e:`${u}${e.startsWith("/")?e.slice(1):e}`;return l.jsx("img",{src:s,...r})};a(`
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
`);const A=a(`
  query GetGovernments {
    governments {
      id
      name
      category
      description
    }
  }
`),i={all:["governments"],lists:()=>[...i.all,"list"],list:e=>[...i.lists(),{filters:e}]},E=a(`
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
`),n={all:["people"],lists:()=>[...n.all,"list"],list:e=>[...n.lists(),{filters:e}]};a(`
  query GetProposalsOrderedByIdDesc {
    proposals(orderBy: [{ id: desc }]) {
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
`);const h=a(`
  query GetProposalById($id: ID!) {
    proposal(where: { id: $id }) {
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
`),S=a(`
  query GetProposalYears {
    budgetYears(orderBy: [{ year: desc }]) {
      id
      year
    }
  }
`),t={all:["proposals"],lists:()=>[...t.all,"list"],list:e=>[...t.lists(),{filters:e}],paginated:(e,r)=>[...t.lists(),"paginated",{where:e,year:r}],details:()=>[...t.all,"detail"],detail:e=>[...t.details(),e],years:()=>[...t.all,"years"]},T={all:["proposals"],lists:()=>[...t.all,"list"],list:e=>[...t.lists(),{filters:e}],paginated:(e,r,o,s,d)=>[...t.lists(),"paginated",{page:e,pageSize:r,sort:o,where:s,year:d}],details:()=>[...t.all,"detail"],detail:e=>[...t.details(),e],years:()=>[...t.all,"years"]},b=a(`
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
`),I=a(`
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
`),$=a(`
  query GetLatestBudgetYear($skip: Int!, $take: Int!) {
    budgetYears(orderBy: [{ year: desc }], skip: $skip, take: $take) {
      year
      budgetProgress
      dataProgress
    }
  }
`),p={all:["budgetYear"],list:(e=0,r=1)=>[...p.all,"list",{skip:e,take:r}],latest:()=>[...p.all,"latest"]},R=a(`
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
`);export{$ as G,_ as I,u as S,I as U,b as a,p as b,P as c,S as d,T as e,R as f,h as g,i as h,A as i,n as j,E as k,t as p};
