import React, { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { execute } from "~/graphql/execute";
import {
  GET_PROPOSAL_GOVERNMENTS_QUERY,
  governmentQueryKeys,
  GET_PEOPLE_LIST_QUERY,
  peopleQueryKeys,
} from "~/queries";
import type { ProposalWhereInput } from "~/graphql/graphql";
import useBudgetSelectStore, {
  useFreezeOnly,
  useSetFreezeOnly,
  useSelectedResult,
  useSetSelectedResult,
} from "~/stores/budget-selector";
import Select, {
  components,
  type DropdownIndicatorProps,
  type SingleValue,
} from "react-select";
import Image from "./image";
import { proposalResultFilterOptions } from "~/constants/options";

type OptionType = {
  value: string;
  label: string;
};

type BudgetOption = {
  title: string;
  value: string;
};

type BudgetsSelectorProps = {
  onSelectionChange?: (selectedValue: string) => void;
  className?: string;
  selectedYear?: number | null;
};

const content = {
  pageTitle: "選擇預算分類方式:",
  options: [
    {
      title: "全部",
      value: "all",
    },
    {
      title: "依部會分類",
      value: "by-department",
    },
    {
      title: "依立委分類",
      value: "by-legislator",
    },
  ] as BudgetOption[],
};

export const DropdownIndicator = (
  props: DropdownIndicatorProps<OptionType>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <Image
        src="/icon/dropdown-container.svg"
        alt="dropdown"
        className="h-2 w-2.5"
      />
    </components.DropdownIndicator>
  );
};

const ByDepartmentSelector = ({
  value,
  selectedYear,
}: {
  value: string;
  selectedYear?: number | null;
}) => {
  // 從 store 取得狀態與 actions
  const departmentFilter = useStore(
    useBudgetSelectStore,
    (state) => state.state.departmentFilter
  );
  const setDepartmentCategory = useStore(
    useBudgetSelectStore,
    (state) => state.actions.setDepartmentCategory
  );
  const setDepartmentId = useStore(
    useBudgetSelectStore,
    (state) => state.actions.setDepartmentId
  );

  const proposalGovernmentWhere = useMemo<ProposalWhereInput>(() => {
    if (!selectedYear) return {};
    return {
      year: {
        year: {
          equals: selectedYear,
        },
      },
    };
  }, [selectedYear]);

  // Fetch governments from proposals so unavailable departments stay hidden.
  const { data: governmentsData, isLoading } = useQuery({
    queryKey: governmentQueryKeys.proposalList({
      year: selectedYear ?? "all",
    }),
    queryFn: () =>
      execute(GET_PROPOSAL_GOVERNMENTS_QUERY, {
        where: proposalGovernmentWhere,
      }),
    enabled: value === "by-department", // 只在選中時 fetch
  });

  const governments = useMemo(() => {
    const uniqueGovernments = new Map<
      string,
      {
        id: string;
        name?: string | null;
        category?: string | null;
        description?: string | null;
      }
    >();

    governmentsData?.proposals?.forEach((proposal) => {
      const government = proposal.government;
      if (government?.id) {
        uniqueGovernments.set(government.id, government);
      }
    });

    return Array.from(uniqueGovernments.values());
  }, [governmentsData?.proposals]);

  // 計算 unique categories
  const categoryOptions = useMemo(() => {
    if (!governments.length) return [];

    const uniqueCategories = Array.from(
      new Set(
        governments
          .map((g) => g.category)
          .filter((c): c is string => c != null && c !== "")
      )
    ).sort();

    return uniqueCategories.map((cat) => ({
      value: cat,
      label: cat,
    }));
  }, [governments]);

  // 根據選定的 category 過濾 departments
  const departmentOptions = useMemo(() => {
    if (!governments.length || !departmentFilter.category) {
      return [];
    }

    const filtered = governments
      .filter((g) => g.category === departmentFilter.category)
      .map((g) => ({
        value: g.id,
        label: g.name || "未命名機關",
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return filtered;
  }, [governments, departmentFilter.category]);

  useEffect(() => {
    if (
      !governmentsData ||
      !departmentFilter.category ||
      categoryOptions.some(
        (option) => option.value === departmentFilter.category
      )
    ) {
      return;
    }

    setDepartmentCategory(null);
  }, [
    categoryOptions,
    departmentFilter.category,
    governmentsData,
    setDepartmentCategory,
  ]);

  useEffect(() => {
    if (
      !governmentsData ||
      !departmentFilter.departmentId ||
      departmentOptions.some(
        (option) => option.value === departmentFilter.departmentId
      )
    ) {
      return;
    }

    setDepartmentId(null);
  }, [
    departmentFilter.departmentId,
    departmentOptions,
    governmentsData,
    setDepartmentId,
  ]);

  // 當前選擇的值（用於 react-select）
  const selectedCategoryValue = departmentFilter.category
    ? { value: departmentFilter.category, label: departmentFilter.category }
    : null;

  const selectedDepartmentValue = useMemo(() => {
    if (!departmentFilter.departmentId || !governments.length) {
      return null;
    }
    const dept = governments.find(
      (g) => g.id === departmentFilter.departmentId
    );
    return dept ? { value: dept.id, label: dept.name || "未命名機關" } : null;
  }, [departmentFilter.departmentId, governments]);

  if (value !== "by-department") return null;

  return (
    <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-2">
      {/* 第一階段：選擇 Category */}
      <Select
        value={selectedCategoryValue}
        onChange={(opt) => {
          const singleValue = opt as SingleValue<OptionType>;
          setDepartmentCategory(singleValue?.value || null);
        }}
        options={categoryOptions}
        components={{ DropdownIndicator }}
        styles={{
          control: (styles) => ({ ...styles, border: "2px solid black" }),
          indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        }}
        placeholder={isLoading ? "載入中..." : "選擇機關類別"}
        isLoading={isLoading}
        isClearable
        aria-label="選擇機關類別"
      />

      {/* 第二階段：選擇 Department */}
      <Select
        value={selectedDepartmentValue}
        onChange={(opt) => {
          const singleValue = opt as SingleValue<OptionType>;
          setDepartmentId(singleValue?.value || null);
        }}
        options={departmentOptions}
        components={{ DropdownIndicator }}
        styles={{
          control: (styles) => ({ ...styles, border: "2px solid black" }),
          indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        }}
        placeholder={
          !departmentFilter.category
            ? "請先選擇類別"
            : departmentOptions.length === 0
              ? "此類別無機關"
              : "選擇機關名稱"
        }
        isDisabled={
          !departmentFilter.category || departmentOptions.length === 0
        }
        isClearable
        aria-label="選擇機關名稱"
      />
    </div>
  );
};

const ByPeopleSelector = ({ value }: { value: string }) => {
  // 從 store 取得狀態與 actions
  const personId = useStore(
    useBudgetSelectStore,
    (state) => state.state.peopleFilter.personId
  );
  const setPersonId = useStore(
    useBudgetSelectStore,
    (state) => state.actions.setPersonId
  );

  // Fetch people list data
  const { data: peopleData, isLoading } = useQuery({
    queryKey: peopleQueryKeys.lists(),
    queryFn: () => execute(GET_PEOPLE_LIST_QUERY),
    enabled: value === "by-legislator", // 只在選中時 fetch
  });

  // 計算選項清單（只顯示立委，不包含政黨）
  const peopleOptions = useMemo(() => {
    if (!peopleData?.peopleList) return [];

    // 過濾出立委（假設 type !== "政黨" 或類似邏輯）
    // 如果需要更精確的過濾，可能需要根據實際資料調整
    return peopleData.peopleList
      .filter((person) => person.name) // 確保有名字
      .map((person) => ({
        value: person.id,
        label: person.name || "未命名",
        party: person.party?.name || null, // 保留政黨資訊以便顯示
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [peopleData?.peopleList]);

  // 當前選擇的值（用於 react-select）
  const selectedPersonValue = useMemo(() => {
    if (!personId || !peopleData?.peopleList) {
      return null;
    }
    const person = peopleData.peopleList.find((p) => p.id === personId);
    return person ? { value: person.id, label: person.name || "未命名" } : null;
  }, [personId, peopleData?.peopleList]);

  if (value !== "by-legislator") return null;

  return (
    <div className="flex flex-col gap-y-3">
      <Select
        value={selectedPersonValue}
        onChange={(opt) => {
          const singleValue = opt as SingleValue<OptionType>;
          setPersonId(singleValue?.value || null);
        }}
        options={peopleOptions}
        components={{ DropdownIndicator }}
        className="md:w-96"
        styles={{
          control: (styles) => ({ ...styles, border: "2px solid black" }),
          indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        }}
        placeholder={isLoading ? "載入中..." : "選擇立法委員"}
        isLoading={isLoading}
        isClearable
        aria-label="選擇立法委員"
      />
    </div>
  );
};

const BudgetsSelector: React.FC<BudgetsSelectorProps> = ({
  onSelectionChange,
  className = "",
  selectedYear = null,
}) => {
  const selectedValue = useStore(
    useBudgetSelectStore,
    (state) => state.state.selectedValue
  );
  const searchedValue = useStore(
    useBudgetSelectStore,
    (state) => state.state.searchedValue
  );
  const visible = useStore(
    useBudgetSelectStore,
    (state) => state.state.visible
  );
  const toggleVisible = useStore(
    useBudgetSelectStore,
    (state) => state.actions.toggleVisible
  );
  const setSearchedValue = useStore(
    useBudgetSelectStore,
    (state) => state.actions.setSearchedValue
  );
  const setSelectedValue = useStore(
    useBudgetSelectStore,
    (state) => state.actions.setSelectedValue
  );
  const clearDepartmentFilter = useStore(
    useBudgetSelectStore,
    (state) => state.actions.clearDepartmentFilter
  );
  const clearPeopleFilter = useStore(
    useBudgetSelectStore,
    (state) => state.actions.clearPeopleFilter
  );
  const freezeOnly = useFreezeOnly();
  const setFreezeOnly = useSetFreezeOnly();
  const selectedResult = useSelectedResult();
  const setSelectedResult = useSetSelectedResult();
  const selectedResultValue = useMemo(
    () =>
      proposalResultFilterOptions.find(
        (option) => option.value === selectedResult
      ) ?? null,
    [selectedResult]
  );

  const handleSelectionChange = (value: string) => {
    setSelectedValue(value);

    // 切換選項時清除相關過濾器
    if (value !== "by-department") {
      clearDepartmentFilter();
    }
    if (value !== "by-legislator") {
      clearPeopleFilter();
    }

    if (onSelectionChange) {
      onSelectionChange(value);
    }
  };

  return (
    <fieldset className={className}>
      <legend className="sr-only">{content.pageTitle}</legend>
      {visible ? (
        <div className="mt-3 space-y-3">
          <div className="flex w-full items-center justify-center gap-x-4 text-sm font-medium text-black">
            <label className="flex items-center gap-x-2">
              <input
                type="radio"
                name="freeze-filter"
                value="all"
                checked={!freezeOnly}
                onChange={() => setFreezeOnly(false)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={!freezeOnly ? "text-black" : "text-gray-500"}>
                全部
              </span>
            </label>
            <label className="flex items-center gap-x-2">
              <input
                type="radio"
                name="freeze-filter"
                value="freeze-only"
                checked={freezeOnly}
                onChange={() => setFreezeOnly(true)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={freezeOnly ? "text-[#e9808e]" : "text-gray-500"}>
                解凍
              </span>
            </label>
          </div>
          {content.options.map((option) => (
            <div
              key={option.value}
              className="flex flex-col items-center justify-start md:flex-row md:gap-x-2"
            >
              <div className="mb-3 flex items-center md:mb-0">
                <input
                  type="radio"
                  id={option.value}
                  name="budget-selector"
                  value={option.value}
                  checked={selectedValue === option.value}
                  onChange={() => handleSelectionChange(option.value)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor={option.value}
                  className="ml-3 block cursor-pointer text-sm font-medium text-gray-700"
                >
                  {option.title}
                </label>
              </div>
              {selectedValue === "by-department" && (
                <ByDepartmentSelector
                  value={option.value}
                  selectedYear={selectedYear}
                />
              )}
              {selectedValue === "by-legislator" && (
                <ByPeopleSelector value={option.value} />
              )}
            </div>
          ))}
          <section className="flex flex-col items-center gap-y-2 md:flex-row md:justify-center md:gap-x-2">
            <label
              htmlFor="budget-result-selector"
              className="text-sm font-medium text-gray-700"
            >
              審議結果：
            </label>
            <Select
              inputId="budget-result-selector"
              value={selectedResultValue}
              onChange={(opt) => {
                const singleValue = opt as SingleValue<OptionType>;
                setSelectedResult(singleValue?.value ?? null);
              }}
              options={proposalResultFilterOptions}
              components={{ DropdownIndicator }}
              className="w-full md:w-60"
              styles={{
                control: (styles) => ({ ...styles, border: "2px solid black" }),
                indicatorSeparator: (styles) => ({
                  ...styles,
                  display: "none",
                }),
              }}
              placeholder="全部審議結果"
              isClearable
              aria-label="選擇審議結果"
            />
          </section>
          <section className="md:flex md:items-center">
            <label htmlFor="budget-search-input" className="mr-2">
              或搜尋：
            </label>
            <input
              id="budget-search-input"
              type="search"
              placeholder="輸入關鍵字搜尋"
              value={searchedValue}
              onChange={(e) => setSearchedValue(e.target.value)}
              className="rounded-sm border-2 bg-white text-center md:w-80"
            />
          </section>
          <button className="flex md:hidden" onClick={toggleVisible}>
            收合
            <Image
              src="/icon/reverse-dropdown-container.svg"
              alt="reverse-dropdown-container"
            />
          </button>
        </div>
      ) : (
        <button className="flex" onClick={toggleVisible}>
          展開
          <Image src="/icon/dropdown-container.svg" alt="dropdown-container" />
        </button>
      )}
    </fieldset>
  );
};

export default BudgetsSelector;
