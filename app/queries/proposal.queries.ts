import { graphql } from "~/graphql";

export const GET_PROPOSALS_QUERY = graphql(`
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
`);

export const GET_PROPOSAL_BY_ID_QUERY = graphql(`
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
`);

export const GET_PROPOSAL_YEARS_QUERY = graphql(`
  query GetProposalYears {
    budgetYears(orderBy: [{ year: desc }]) {
      id
      year
      budgetProgress
      dataProgress
      unfreezeProgress
    }
  }
`);

/**
 * React Query keys for proposal-related queries
 * Following the recommended hierarchical pattern
 */
export const proposalQueryKeys = {
  all: ["proposals"] as const,
  lists: () => [...proposalQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [
    ...proposalQueryKeys.lists(),
    { filters },
  ],
  // 新增: 分頁查詢 keys
  paginated: (
    where?: Record<string, unknown>,
    year?: number | string | null // 新增 year 參數
  ) =>
    [
      ...proposalQueryKeys.lists(),
      "paginated",
      { where, year }, // 將 year 加入 key
    ] as const,
  details: () => [...proposalQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...proposalQueryKeys.details(), id] as const,
  years: () => [...proposalQueryKeys.all, "years"] as const,
} as const;

export const proposalQueryKeysWithOrderAndSkip = {
  all: ["proposals"] as const,
  lists: () => [...proposalQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [
    ...proposalQueryKeys.lists(),
    { filters },
  ],
  // 新增: 分頁查詢 keys
  paginated: (
    page: number,
    pageSize: number,
    sort: string,
    where?: Record<string, unknown>,
    year?: number | string | null // 新增 year 參數
  ) =>
    [
      ...proposalQueryKeys.lists(),
      "paginated",
      { page, pageSize, sort, where, year },
    ] as const,
  details: () => [...proposalQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...proposalQueryKeys.details(), id] as const,
  years: () => [...proposalQueryKeys.all, "years"] as const,
} as const;

export const GET_PAGINATED_PROPOSALS_QUERY = graphql(`
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
`);

export const UPDATE_PROPOSAL_REACTS = graphql(`
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
`);
