import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "./Breadcrumb";

export function PageHeader({ title, intro, crumbs, children }: { title: ReactNode; intro?: ReactNode; crumbs?: Crumb[]; children?: ReactNode }) {
  return (
    <header className="container-site pb-10 pt-8 sm:pb-14 sm:pt-12">
      {crumbs && <Breadcrumb items={crumbs} className="mb-8" />}
      <span className="rule mb-5" aria-hidden />
      <h1 className="display text-[2.6rem] sm:text-[4.2rem]">{title}</h1>
      {intro && <p className="lead mt-5 max-w-xl">{intro}</p>}
      {children}
    </header>
  );
}
