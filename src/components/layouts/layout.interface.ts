import { ReactNode } from "react";

export interface LayoutProps {
    children: ReactNode;
    title: string;
    content?: string
}
