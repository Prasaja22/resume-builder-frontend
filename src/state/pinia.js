import { useLayoutStore } from "./pinia/layout";
import { useAuthStore } from "./pinia/auth";
import { useUserStore } from "./pinia/user";
import { createPinia } from "pinia";
import { useExperiencestore } from "./pinia/experience";
import { useEducationstore } from "./pinia/education";
import { useProjectstore } from "./pinia/project";
import { useSummariestore } from "./pinia/summary";

const pinia = createPinia();
export default pinia;

export {
  useLayoutStore,
  useAuthStore,
  useUserStore,
  useExperiencestore,
  useEducationstore,
  useProjectstore,
  useSummariestore,
};
