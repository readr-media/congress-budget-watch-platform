import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { find, filter, sumBy } from "lodash";
import { useMediaQuery } from "usehooks-ts";
import { execute } from "~/graphql/execute";
import {
  GET_VISUALIZATION_PROPOSALS_QUERY,
  proposalQueryKeys,
} from "~/queries";
import {
  OrderDirection,
  ProposalProposalTypeType,
  VisualizationProposalBaseFragmentDoc,
  VisualizationProposalWithContextFragmentDoc,
  type ProposalOrderByInput,
  type ProposalWhereInput,
  type GetVisualizationProposalsQuery,
} from "~/graphql/graphql";
import { sortOptions } from "~/constants/options";
import {
  formatAmountWithUnit,
  mapVisualizationProposals,
  transformToGroupedByLegislatorData,
  type VisualizationGroupedData,
} from "./helpers";
import { useFragment } from "~/graphql";
import type {
  SelectOption,
  VisualizationMode,
  VisualizationTab,
} from "~/types/visualization";

const YEAR_OPTIONS: SelectOption[] = [
  { value: "114", label: "114年度 (2025)" },
  { value: "113", label: "113年度 (2024)" },
];

type SummaryStats = {
  totalReductionAmount: number;
  reductionCount: number;
  totalFreezeAmount: number;
  freezeCount: number;
  mainResolutionCount: number;
};

type UseVisualizationStateResult = {
  activeTab: VisualizationTab;
  handleTabChange: (tab: VisualizationTab) => void;
  mode: VisualizationMode;
  setMode: (mode: VisualizationMode) => void;
  selectedYear: SelectOption;
  handleYearChange: (option: SelectOption) => void;
  yearOptions: SelectOption[];
  legislatorOptions: SelectOption[];
  selectedLegislatorOption: SelectOption | null;
  handleLegislatorChange: (option: SelectOption | null) => void;
  departmentOptions: SelectOption[];
  selectedDepartmentOption: SelectOption | null;
  handleDepartmentChange: (option: SelectOption | null) => void;
  handleToggleShowAll: () => void;
  isShowingAll: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  isLoading: boolean;
  isError: boolean;
  rawData: GetVisualizationProposalsQuery | undefined;
  visualizationData: GetVisualizationProposalsQuery | null;
  legislatorVisualizationData: VisualizationGroupedData | null;
  summaryStats: SummaryStats;
  formattedReductionAmount: string;
  formattedFreezeAmount: string;
};

const useVisualizationState = (): UseVisualizationStateResult => {
  const [activeTab, setActiveTab] = useState<VisualizationTab>("legislator");
  const [mode, setMode] = useState<VisualizationMode>("amount");
  const [selectedYear, setSelectedYear] = useState<SelectOption>(
    YEAR_OPTIONS[0]
  );
  const [selectedLegislatorOption, setSelectedLegislatorOption] =
    useState<SelectOption | null>(null);
  const [selectedDepartmentOption, setSelectedDepartmentOption] =
    useState<SelectOption | null>(null);

  const previousLegislatorOption = useRef<SelectOption | null>(null);
  const previousDepartmentOption = useRef<SelectOption | null>(null);
  const [shouldAutoSelectLegislator, setShouldAutoSelectLegislator] =
    useState(true);
  const [shouldAutoSelectDepartment, setShouldAutoSelectDepartment] =
    useState(true);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isMobile = !isDesktop;

  const selectedSort = "id-asc";
  const currentPage = 1;

  const whereFilter = useCallback((): ProposalWhereInput => {
    return {
      year: {
        year: { equals: parseInt(selectedYear.value, 10) },
      },
      mergedParentProposals: null,
      historicalParentProposals: null,
      result: {
        equals: "passed",
      },
    };
  }, [selectedYear.value]);

  const orderBy = useMemo((): ProposalOrderByInput[] => {
    const sortOption = find(sortOptions, (o) => o.value === selectedSort);
    if (!sortOption) {
      return [{ id: OrderDirection.Desc }];
    }

    const direction =
      sortOption.direction === "asc" ? OrderDirection.Asc : OrderDirection.Desc;

    return [
      {
        [sortOption.field]: direction,
      },
    ];
  }, [selectedSort]);

  const { data, isLoading, isError } = useQuery({
    queryKey: proposalQueryKeys.paginated(
      currentPage,
      selectedSort,
      whereFilter(),
      parseInt(selectedYear.value, 10)
    ),
    queryFn: () =>
      execute(GET_VISUALIZATION_PROPOSALS_QUERY, {
        skip: 0,
        orderBy,
        where: whereFilter(),
      }),
    placeholderData: keepPreviousData,
  });

  const handleTabChange = useCallback(
    (tab: VisualizationTab) => {
      setActiveTab(tab);
      if (isDesktop) return;
      if (tab === "legislator") {
        setShouldAutoSelectLegislator(true);
        return;
      }
      setShouldAutoSelectDepartment(true);
    },
    [isDesktop]
  );

  useEffect(() => {
    if (!isDesktop) return;
    setSelectedLegislatorOption(null);
    setSelectedDepartmentOption(null);
    setShouldAutoSelectLegislator(true);
    setShouldAutoSelectDepartment(true);
  }, [isDesktop]);

  const handleYearChange = useCallback((option: SelectOption) => {
    setSelectedYear(option);
  }, []);

  const handleLegislatorChange = useCallback((option: SelectOption | null) => {
    setSelectedLegislatorOption(option);
    setShouldAutoSelectLegislator(false);
    if (option) {
      previousLegislatorOption.current = option;
    }
  }, []);

  const handleDepartmentChange = useCallback((option: SelectOption | null) => {
    setSelectedDepartmentOption(option);
    setShouldAutoSelectDepartment(false);
    if (option) {
      previousDepartmentOption.current = option;
    }
  }, []);

  const handleToggleShowAll = useCallback(() => {
    if (activeTab === "legislator") {
      if (selectedLegislatorOption) {
        previousLegislatorOption.current = selectedLegislatorOption;
        setSelectedLegislatorOption(null);
        setShouldAutoSelectLegislator(false);
      } else if (previousLegislatorOption.current) {
        setSelectedLegislatorOption(previousLegislatorOption.current);
        setShouldAutoSelectLegislator(false);
      }
    } else if (activeTab === "department") {
      if (selectedDepartmentOption) {
        previousDepartmentOption.current = selectedDepartmentOption;
        setSelectedDepartmentOption(null);
        setShouldAutoSelectDepartment(false);
      } else if (previousDepartmentOption.current) {
        setSelectedDepartmentOption(previousDepartmentOption.current);
        setShouldAutoSelectDepartment(false);
      }
    }
  }, [activeTab, selectedLegislatorOption, selectedDepartmentOption]);

  const allProposals = useMemo(() => mapVisualizationProposals(data), [data]);

  const legislatorOptions = useMemo<SelectOption[]>(() => {
    const unique = new Map<string, SelectOption>();
    allProposals.forEach((proposal) => {
      const proposer = proposal.proposers?.[0];
      const value = proposer?.id ?? proposer?.name ?? "";
      const label = proposer?.name ?? "未命名立委";
      if (value) {
        unique.set(value, { value, label });
      }
    });
    return Array.from(unique.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "zh-Hant")
    );
  }, [allProposals]);

  const departmentOptions = useMemo<SelectOption[]>(() => {
    const unique = new Map<string, SelectOption>();
    allProposals.forEach((proposal) => {
      const category = proposal.government?.category?.trim();
      const value = category && category.length > 0 ? category : "未分類";
      unique.set(value, { value, label: value });
    });
    return Array.from(unique.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "zh-Hant")
    );
  }, [allProposals]);

  const filteredLegislatorProposalIds = useMemo(() => {
    if (isDesktop) return null;
    if (activeTab !== "legislator" || !selectedLegislatorOption) return null;
    const ids = allProposals
      .filter((proposal) => {
        const proposer = proposal.proposers?.[0];
        const value = proposer?.id ?? proposer?.name ?? "";
        return value === selectedLegislatorOption.value;
      })
      .map((proposal) => proposal.id)
      .filter((id): id is string => Boolean(id));
    return new Set(ids);
  }, [activeTab, allProposals, isDesktop, selectedLegislatorOption]);

  const filteredDepartmentProposalIds = useMemo(() => {
    if (isDesktop) return null;
    if (activeTab !== "department" || !selectedDepartmentOption) return null;
    const ids = allProposals
      .filter((proposal) => {
        const category = proposal.government?.category?.trim();
        const value = category && category.length > 0 ? category : "未分類";
        return value === selectedDepartmentOption.value;
      })
      .map((proposal) => proposal.id)
      .filter((id): id is string => Boolean(id));
    return new Set(ids);
  }, [activeTab, allProposals, isDesktop, selectedDepartmentOption]);

  useEffect(() => {
    if (!isMobile) return;

    if (activeTab === "legislator") {
      const hasSelection =
        selectedLegislatorOption &&
        legislatorOptions.some(
          (option) => option.value === selectedLegislatorOption.value
        );
      if (!hasSelection) {
        if (shouldAutoSelectLegislator && legislatorOptions.length > 0) {
          setSelectedLegislatorOption(legislatorOptions[0]);
        } else if (selectedLegislatorOption) {
          setSelectedLegislatorOption(null);
        }
      }
    } else if (activeTab === "department") {
      const hasSelection =
        selectedDepartmentOption &&
        departmentOptions.some(
          (option) => option.value === selectedDepartmentOption.value
        );
      if (!hasSelection) {
        if (shouldAutoSelectDepartment && departmentOptions.length > 0) {
          setSelectedDepartmentOption(departmentOptions[0]);
        } else if (selectedDepartmentOption) {
          setSelectedDepartmentOption(null);
        }
      }
    }
  }, [
    activeTab,
    departmentOptions,
    isMobile,
    legislatorOptions,
    selectedDepartmentOption,
    selectedLegislatorOption,
    shouldAutoSelectDepartment,
    shouldAutoSelectLegislator,
  ]);

  const effectiveData = useMemo(() => {
    if (!data) return null;
    if (isDesktop) return data;

    let filteredIds: Set<string> | null = null;
    if (activeTab === "legislator" && filteredLegislatorProposalIds) {
      filteredIds = filteredLegislatorProposalIds;
    } else if (activeTab === "department" && filteredDepartmentProposalIds) {
      filteredIds = filteredDepartmentProposalIds;
    }

    if (!filteredIds) {
      return data;
    }

    const filteredProposals =
      data.proposals?.filter((proposal) => {
        if (!proposal) return false;
        const proposalWithContext = useFragment(
          VisualizationProposalWithContextFragmentDoc,
          proposal
        );
        const base = useFragment(
          VisualizationProposalBaseFragmentDoc,
          proposalWithContext
        );
        const proposalId = base.id;
        return proposalId != null && filteredIds?.has(proposalId);
      }) ?? [];

    return { ...data, proposals: filteredProposals };
  }, [
    activeTab,
    data,
    filteredDepartmentProposalIds,
    filteredLegislatorProposalIds,
    isDesktop,
  ]);

  const visualizationData = effectiveData ?? data ?? null;

  const summaryStats = useMemo<SummaryStats>(() => {
    const proposals = mapVisualizationProposals(effectiveData);

    const reductionProposals = filter(
      proposals,
      (p) => p.reductionAmount && p.reductionAmount > 0
    );

    const freezeProposals = filter(
      proposals,
      (p) => p.freezeAmount && p.freezeAmount > 0
    );

    const mainResolutionProposals = filter(proposals, (p) =>
      p.proposalTypes?.includes(ProposalProposalTypeType.Other)
    );

    return {
      totalReductionAmount: sumBy(reductionProposals, "reductionAmount"),
      reductionCount: reductionProposals.length,
      totalFreezeAmount: sumBy(freezeProposals, "freezeAmount"),
      freezeCount: freezeProposals.length,
      mainResolutionCount: mainResolutionProposals.length,
    };
  }, [effectiveData]);

  const formattedReductionAmount = formatAmountWithUnit(
    summaryStats.totalReductionAmount
  );
  const formattedFreezeAmount = formatAmountWithUnit(
    summaryStats.totalFreezeAmount
  );

  const legislatorVisualizationData =
    useMemo<VisualizationGroupedData | null>(() => {
      if (!effectiveData) return null;
      return transformToGroupedByLegislatorData(effectiveData, mode);
    }, [effectiveData, mode]);

  const isShowingAll =
    (activeTab === "legislator" && !selectedLegislatorOption) ||
    (activeTab === "department" && !selectedDepartmentOption);

  return {
    activeTab,
    handleTabChange,
    mode,
    setMode,
    selectedYear,
    handleYearChange,
    yearOptions: YEAR_OPTIONS,
    legislatorOptions,
    selectedLegislatorOption,
    handleLegislatorChange,
    departmentOptions,
    selectedDepartmentOption,
    handleDepartmentChange,
    handleToggleShowAll,
    isShowingAll,
    isDesktop,
    isMobile,
    isLoading,
    isError,
    rawData: data,
    visualizationData,
    legislatorVisualizationData,
    summaryStats,
    formattedReductionAmount,
    formattedFreezeAmount,
  };
};

export { YEAR_OPTIONS, useVisualizationState };
