import { createComponent } from "solid-js/web";

export const App = ({ Page, props }: any) => {
  return createComponent(Page, props);
};