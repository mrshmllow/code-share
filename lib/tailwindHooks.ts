import create from "@kodingdotninja/use-tailwind-breakpoint";

const screens = {
  sm: "640px",
  md: "768px",
};

export const { useBreakpointValue } = create(screens);
