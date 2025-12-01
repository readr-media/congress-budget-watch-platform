import { useParams, redirect } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "usehooks-ts";
import { execute } from "~/graphql/execute";
import { GET_PROPOSAL_BY_ID_QUERY, proposalQueryKeys } from "~/queries";
import { ERROR_REDIRECT_ROUTE } from "~/constants/endpoints";
import BudgetDetailSkeleton from "~/components/skeleton/budget-detail-skeleton";
import {
  formatBudgetCategory,
  formatMergedProposals,
  formatNumber,
  getProposalTypeDisplay,
  getResultDisplay,
  meetingsToTimeline,
  hasMergedProposals,
  hasHistoricalProposals,
} from "./helpers";
import type { Proposal } from "~/graphql/graphql";
import BudgetDetailView from "./BudgetDetailView";

const BudgetDetail = () => {
  const ShowLastYearData = false;
  const { id } = useParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Fetch proposal data
  const { data, isLoading, isError } = useQuery({
    queryKey: proposalQueryKeys.detail(id!),
    queryFn: () => execute(GET_PROPOSAL_BY_ID_QUERY, { id: id! }),
    enabled: !!id, // Only run query if id exists
  });

  // Handle loading and error states
  if (isLoading) return <BudgetDetailSkeleton isDesktop={isDesktop} />;
  if (isError || !data?.proposal) return redirect(ERROR_REDIRECT_ROUTE);

  const proposal = data.proposal as Proposal;

  // Transform data for rendering
  const timelineData = meetingsToTimeline(
    proposal.meetings,
    proposal.historicalProposals
  );
  const mergedProposalsData = formatMergedProposals(
    proposal.mergedProposals,
    proposal.mergedParentProposals
  );
  const hasMerged = hasMergedProposals(proposal);

  const hasImage = !!proposal.budgetImageUrl;

  // Prepare display values
  const budget = proposal.budget;
  const proposerName = proposal.proposers
    ?.map((proposer) => proposer.name)
    .join("、");
  const cosignersText =
    proposal.coSigners && proposal.coSigners.length > 0
      ? proposal.coSigners.map((s) => s.name).join("、")
      : "無";
  const proposalType = getProposalTypeDisplay(proposal.proposalTypes);
  const resultText = getResultDisplay(proposal.result);
  const parentProposalId =
    proposal.historicalParentProposals?.id ??
    proposal.mergedParentProposals?.id;

  const budgetCategory = formatBudgetCategory(
    proposal.budget?.majorCategory,
    proposal.budget?.mediumCategory,
    proposal.budget?.minorCategory
  );
  const hasBudgetCategory =
    Boolean(budget?.majorCategory) ||
    Boolean(budget?.mediumCategory) ||
    Boolean(budget?.minorCategory);
  const projectDescription = budget?.projectDescription ?? "";
  const hasProjectDescription = projectDescription.trim().length > 0;
  type BudgetWithHistorical = typeof budget & {
    lastYearLegalBudget?: number | null;
    lastYearComparison?: number | null;
  };
  const budgetWithHistorical = budget as BudgetWithHistorical | null;
  const lastYearSettlementValue = budget?.lastYearSettlement;
  const hasLastYearSettlement =
    lastYearSettlementValue !== null && lastYearSettlementValue !== undefined;
  const lastYearLegalBudgetValue =
    budgetWithHistorical?.lastYearLegalBudget ?? null;
  const hasLastYearLegalBudget =
    lastYearLegalBudgetValue !== null && lastYearLegalBudgetValue !== undefined;
  const lastYearComparisonValue =
    budgetWithHistorical?.lastYearComparison ?? null;
  const hasLastYearComparison =
    lastYearComparisonValue !== null && lastYearComparisonValue !== undefined;
  const shouldShowBudgetInfo =
    hasBudgetCategory ||
    hasProjectDescription ||
    hasLastYearSettlement ||
    hasLastYearLegalBudget ||
    hasLastYearComparison;
  const budgetCategoryDisplay = hasBudgetCategory ? budgetCategory : "";
  const projectDescriptionDisplay = hasProjectDescription
    ? projectDescription
    : "";
  const lastYearSettlementDisplay = hasLastYearSettlement
    ? formatNumber(lastYearSettlementValue)
    : "";
  const lastYearLegalBudgetDisplay = hasLastYearLegalBudget
    ? formatNumber(lastYearLegalBudgetValue)
    : "";
  const lastYearComparisonDisplay = hasLastYearComparison
    ? formatNumber(lastYearComparisonValue)
    : "";
  const showLastYearSection = ShowLastYearData && shouldShowBudgetInfo;
  const proposalKey = `${proposal.id}-${proposal.react_good}-${proposal.react_angry}-${proposal.react_disappoint}-${proposal.react_whatever}`;

  return (
    <BudgetDetailView
      isDesktop={isDesktop}
      proposal={proposal}
      timelineData={timelineData}
      mergedProposalsData={mergedProposalsData}
      hasMerged={hasMerged}
      hasImage={hasImage}
      proposerName={proposerName || ""}
      cosignersText={cosignersText}
      proposalType={proposalType}
      resultText={resultText}
      parentProposalId={parentProposalId}
      hasHistoricalProposals={hasHistoricalProposals(proposal)}
      budgetCategoryDisplay={budgetCategoryDisplay}
      projectDescriptionDisplay={projectDescriptionDisplay}
      lastYearSettlementDisplay={lastYearSettlementDisplay}
      lastYearLegalBudgetDisplay={lastYearLegalBudgetDisplay}
      lastYearComparisonDisplay={lastYearComparisonDisplay}
      showLastYearSection={showLastYearSection}
      shouldShowBudgetInfo={shouldShowBudgetInfo}
      proposalKey={proposalKey}
    />
  );
};

export default BudgetDetail;
