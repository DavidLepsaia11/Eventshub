// src/components/PageHeader.tsx

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-7">
      <div>
        <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-[13.5px] text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
