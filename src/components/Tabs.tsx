import type { ComponentProps } from "react";
import { Tabs as TabsPrimitive } from "radix-ui";

export function Tabs(props: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root {...props} />;
}

export function TabsList(props: ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List {...props} />;
}

export function TabsTrigger(props: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return <TabsPrimitive.Trigger {...props} />;
}

export function TabsContent(props: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content {...props} />;
}
