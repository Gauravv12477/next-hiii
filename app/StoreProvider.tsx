// app/StoreProvider.tsx
"use client"; // Ensure this line is present

import { Provider } from "react-redux";
import { store } from "@/store/store"; // Adjust the import path accordingly

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
