import { useState, ReactNode } from "react";

interface StackTabsProps {
  tabs: { label: string; value: string }[];
  children: (activeTab: string) => ReactNode;
}

const StackTabs = ({ tabs, children }: StackTabsProps) => {
  const [active, setActive] = useState(tabs[0].value);

  return (
    <div>
      <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card/50 p-0.5 mb-3 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              active === tab.value
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children(active)}
    </div>
  );
};

export default StackTabs;
