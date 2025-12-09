import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "usehooks-ts";
import { execute } from "~/graphql/execute";
import {
  GET_VISUALIZATION_PROPOSALS_QUERY,
  proposalQueryKeys,
} from "~/queries";
import {
  VisualizationProposalBaseFragmentDoc,
  VisualizationProposalWithContextFragmentDoc,
  type ProposalWhereInput,
  type GetVisualizationProposalsQuery,
} from "~/graphql/graphql";
import { YEAR_OPTIONS } from "~/constants/options";
import {
  getProposerKey,
  mapVisualizationProposals,
  transformToCategorizedData,
  transformToGroupedByLegislatorData,
  type VisualizationGroupedData,
  type NodeDatum,
} from "./helpers";
import { useFragment } from "~/graphql";
import {
  type SelectOption,
  VisualizationMode,
  VisualizationTab,
} from "~/types/visualization";
import type { UseVisualizationStateResult } from "./types";

const useVisualizationState = (): UseVisualizationStateResult => {
  const [activeTab, setActiveTab] = useState<VisualizationTab>(
    VisualizationTab.Legislator
  );
  const [mode, setMode] = useState<VisualizationMode>(VisualizationMode.Amount);
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

  const { data, isLoading, isError } = useQuery({
    queryKey: proposalQueryKeys.paginated(
      whereFilter(),
      parseInt(selectedYear.value, 10)
    ),
    queryFn: () =>
      execute(GET_VISUALIZATION_PROPOSALS_QUERY, {
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

  const allProposals = useMemo(() => mapVisualizationProposals(data), [data]);

  const legislatorOptions = useMemo<SelectOption[]>(() => {
    const unique = new Map<string, SelectOption>();
    allProposals.forEach((proposal) => {
      const proposers = proposal.proposers?.length
        ? proposal.proposers
        : [];
      proposers.forEach((proposer, index) => {
        const value = getProposerKey(proposer, proposal.id, index);
        if (!value) return;
        const label = proposer?.name ?? "未命名立委";
        if (!unique.has(value)) {
          unique.set(value, { value, label });
        }
      });
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

  const handleToggleShowAll = useCallback(() => {
    if (activeTab === "legislator") {
      if (selectedLegislatorOption) {
        previousLegislatorOption.current = selectedLegislatorOption;
        setSelectedLegislatorOption(null);
        setShouldAutoSelectLegislator(false);
      } else if (previousLegislatorOption.current) {
        setSelectedLegislatorOption(previousLegislatorOption.current);
        setShouldAutoSelectLegislator(false);
      } else if (legislatorOptions.length > 0) {
        setSelectedLegislatorOption(legislatorOptions[0]);
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
      } else if (departmentOptions.length > 0) {
        setSelectedDepartmentOption(departmentOptions[0]);
        setShouldAutoSelectDepartment(false);
      }
    }
  }, [
    activeTab,
    selectedLegislatorOption,
    selectedDepartmentOption,
    legislatorOptions,
    departmentOptions,
  ]);

  const normalizeDepartmentCategory = useCallback(
    (category?: string | null) => {
      const trimmed = category?.trim();
      return trimmed && trimmed.length > 0 ? trimmed : "未分類";
    },
    []
  );

  const filteredLegislatorProposalIds = useMemo(() => {
    if (isDesktop) return null;
    if (activeTab !== "legislator" || !selectedLegislatorOption) return null;
    const ids = allProposals
      .filter((proposal) => {
        const proposers = proposal.proposers ?? [];
        if (proposers.length === 0) return false;
        return proposers.some((proposer, index) => {
          const key = getProposerKey(proposer, proposal.id, index);
          return key === selectedLegislatorOption.value;
        });
      })
      .map((proposal) => proposal.id)
      .filter((id): id is string => Boolean(id));
    return new Set(ids);
  }, [activeTab, allProposals, isDesktop, selectedLegislatorOption]);

  const filteredDepartmentProposalIds = useMemo(() => {
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
  }, [activeTab, allProposals, selectedDepartmentOption]);

  const selectedDepartmentCategorizedData = useMemo<Record<
    string,
    NodeDatum
  > | null>(() => {
    if (
      !data ||
      activeTab !== "department" ||
      !selectedDepartmentOption ||
      !selectedDepartmentOption.value
    ) {
      return null;
    }

    const filteredProposals =
      data.proposals?.filter((proposal) => {
        if (!proposal) return false;
        const proposalWithContext = useFragment(
          VisualizationProposalWithContextFragmentDoc,
          proposal
        );
        const category = normalizeDepartmentCategory(
          proposalWithContext.government?.category ?? null
        );
        return category === selectedDepartmentOption.value;
      }) ?? [];

    if (!filteredProposals.length) {
      return null;
    }

    const filteredData: GetVisualizationProposalsQuery = {
      ...data,
      proposals: filteredProposals,
    };

    return transformToCategorizedData(filteredData, mode);
  }, [
    activeTab,
    data,
    mode,
    normalizeDepartmentCategory,
    selectedDepartmentOption,
  ]);

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

  useEffect(() => {
    if (!isDesktop) return;
    if (activeTab !== "department") return;
    const hasSelection =
      selectedDepartmentOption &&
      departmentOptions.some(
        (option) => option.value === selectedDepartmentOption.value
      );
    if (!hasSelection && departmentOptions.length > 0) {
      setSelectedDepartmentOption(departmentOptions[0]);
      setShouldAutoSelectDepartment(false);
    }
  }, [activeTab, departmentOptions, isDesktop, selectedDepartmentOption]);

  const effectiveData = useMemo(() => {
    if (!data) return null;

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
  ]);

  const visualizationData = effectiveData ?? data ?? null;

  const legislatorVisualizationData =
    useMemo<VisualizationGroupedData | null>(() => {
      if (!effectiveData) return null;
      const baseData = transformToGroupedByLegislatorData(effectiveData, mode);
      const shouldFilterBySelection =
        !isDesktop && activeTab === "legislator" && selectedLegislatorOption;
      if (!shouldFilterBySelection) {
        return baseData;
      }
      const rootNode = baseData[""];
      if (!rootNode?.children) {
        return baseData;
      }
      const filteredChildren = rootNode.children.filter((child) => {
        return (
          child.proposerId === selectedLegislatorOption.value ||
          child.proposerKey === selectedLegislatorOption.value
        );
      });
      return {
        ...baseData,
        "": {
          ...rootNode,
          children: filteredChildren,
        },
      };
    }, [
      activeTab,
      effectiveData,
      isDesktop,
      mode,
      selectedLegislatorOption,
    ]);

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
    selectedDepartmentCategorizedData,
  };
};

export { useVisualizationState };
