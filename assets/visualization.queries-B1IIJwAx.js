import{g as r}from"./gql-CXkKbLhy.js";r(`
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
`);const m=r(`
  query GetGovernments {
    governments {
      id
      name
      category
      description
    }
  }
`),s={all:["governments"],lists:()=>[...s.all,"list"],list:e=>[...s.lists(),{filters:e}]},u=r(`
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
`),o={all:["people"],lists:()=>[...o.all,"list"],list:e=>[...o.lists(),{filters:e}]};r(`
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
`);const y=r(`
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
`),g=r(`
  query GetProposalYears {
    budgetYears(orderBy: [{ year: desc }]) {
      id
      year
      budgetProgress
      dataProgress
      unfreezeProgress
    }
  }
`),t={all:["proposals"],lists:()=>[...t.all,"list"],list:e=>[...t.lists(),{filters:e}],paginated:(e,a)=>[...t.lists(),"paginated",{where:e,year:a}],details:()=>[...t.all,"detail"],detail:e=>[...t.details(),e],years:()=>[...t.all,"years"]},c={all:["proposals"],lists:()=>[...t.all,"list"],list:e=>[...t.lists(),{filters:e}],paginated:(e,a,n,p,d)=>[...t.lists(),"paginated",{page:e,pageSize:a,sort:n,where:p,year:d}],details:()=>[...t.all,"detail"],detail:e=>[...t.details(),e],years:()=>[...t.all,"years"]},P=r(`
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
`),_=r(`
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
`),A=r(`
  query GetLatestBudgetYear($skip: Int!, $take: Int!) {
    budgetYears(orderBy: [{ year: desc }], skip: $skip, take: $take) {
      year
      budgetProgress
      dataProgress
      unfreezeProgress
    }
  }
`),i={all:["budgetYear"],list:(e=0,a=1)=>[...i.all,"list",{skip:e,take:a}],latest:()=>[...i.all,"latest"]},h=r(`
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
`);export{A as G,_ as U,P as a,i as b,g as c,c as d,h as e,y as f,s as g,m as h,o as i,u as j,t as p};
