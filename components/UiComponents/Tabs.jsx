import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TabComponent = ({ tabs, defaultValue }) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="bg-slate-200">
        {tabs?.map(({ label }, i) => (
          <TabsTrigger key={i} value={label}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs?.map(({ Component, label }, i) => (
        <TabsContent key={i} value={label}>
          {Component}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabComponent;
