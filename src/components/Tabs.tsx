import {
  createContext,
  useContext,
  useState,
  useRef,
  useId,
  type ReactNode,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  baseId: string;
  orientation: "horizontal" | "vertical";
  registerTab: (value: string, element: HTMLButtonElement | null) => void;
  unregisterTab: (value: string) => void;
  tabValuesRef: React.MutableRefObject<string[]>;
  tabElementsRef: React.MutableRefObject<Map<string, HTMLButtonElement>>;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Tabs({
  defaultValue = "",
  value,
  onValueChange,
  orientation = "horizontal",
  children,
  className = "",
  id,
}: TabsProps) {
  const generatedId = useId();
  const baseId = id || `tabs-${generatedId.replace(/:/g, "")}`;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value !== undefined ? value : internalValue;

  const tabValuesRef = useRef<string[]>([]);
  const tabElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleSetActiveTab = (newVal: string) => {
    if (value === undefined) {
      setInternalValue(newVal);
    }
    if (onValueChange) {
      onValueChange(newVal);
    }
  };

  const registerTab = (tabVal: string, element: HTMLButtonElement | null) => {
    if (element) {
      tabElementsRef.current.set(tabVal, element);
      if (!tabValuesRef.current.includes(tabVal)) {
        tabValuesRef.current.push(tabVal);
      }
    }
  };

  const unregisterTab = (tabVal: string) => {
    tabElementsRef.current.delete(tabVal);
    tabValuesRef.current = tabValuesRef.current.filter((v) => v !== tabVal);
  };

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab: handleSetActiveTab,
        baseId,
        orientation,
        registerTab,
        unregisterTab,
        tabValuesRef,
        tabElementsRef,
      }}
    >
      <div className={`tabs-root ${className}`} data-orientation={orientation}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function TabsList({
  children,
  className = "",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: TabsListProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsList must be used within a Tabs component");
  }

  const { orientation } = context;

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={`tab-list ${className}`}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

export function TabsTrigger({
  value,
  children,
  className = "",
  disabled = false,
  "aria-label": ariaLabel,
}: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }

  const {
    activeTab,
    setActiveTab,
    baseId,
    orientation,
    registerTab,
    unregisterTab,
    tabValuesRef,
    tabElementsRef,
  } = context;

  const isSelected = activeTab === value;
  const tabId = `tab-${baseId}-${value}`;
  const panelId = `tabpanel-${baseId}-${value}`;

  const setButtonRef = (el: HTMLButtonElement | null) => {
    if (el) {
      registerTab(value, el);
    } else {
      unregisterTab(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const values = tabValuesRef.current;
    if (values.length === 0) return;

    const currentIndex = values.indexOf(value);
    if (currentIndex === -1) return;

    let targetIndex = -1;

    if (orientation === "horizontal") {
      if (e.key === "ArrowRight") {
        targetIndex = (currentIndex + 1) % values.length;
      } else if (e.key === "ArrowLeft") {
        targetIndex = (currentIndex - 1 + values.length) % values.length;
      }
    } else {
      if (e.key === "ArrowDown") {
        targetIndex = (currentIndex + 1) % values.length;
      } else if (e.key === "ArrowUp") {
        targetIndex = (currentIndex - 1 + values.length) % values.length;
      }
    }

    if (e.key === "Home") {
      targetIndex = 0;
    } else if (e.key === "End") {
      targetIndex = values.length - 1;
    }

    if (targetIndex !== -1) {
      e.preventDefault();
      const targetVal = values[targetIndex];
      setActiveTab(targetVal);
      const targetEl = tabElementsRef.current.get(targetVal);
      targetEl?.focus();
    }
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    setActiveTab(value);
  };

  return (
    <button
      ref={setButtonRef}
      id={tabId}
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-controls={panelId}
      aria-label={ariaLabel}
      disabled={disabled}
      tabIndex={isSelected ? 0 : -1}
      data-state={isSelected ? "active" : "inactive"}
      className={`tab-trigger ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className = "" }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }

  const { activeTab, baseId } = context;
  const isSelected = activeTab === value;
  const tabId = `tab-${baseId}-${value}`;
  const panelId = `tabpanel-${baseId}-${value}`;

  if (!isSelected) {
    return null;
  }

  return (
    <div
      id={panelId}
      role="tabpanel"
      tabIndex={0}
      aria-labelledby={tabId}
      data-state={isSelected ? "active" : "inactive"}
      className={`tab-content ${className}`}
    >
      {children}
    </div>
  );
}

