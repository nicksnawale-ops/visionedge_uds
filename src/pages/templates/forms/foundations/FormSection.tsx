import React, { useId } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  /** Anchor id (section index, error summary). */
  id?: string;
  overlay?: React.ReactNode;
  /** Header action, e.g. "Edit" on review cards. */
  action?: React.ReactNode;
  children: React.ReactNode;
}

/** Section card: white, 1px Gray 200, 12px radius, 24px padding; H4 title + 12px description; fields 16px apart. */
export const FormSection: React.FC<FormSectionProps> = ({ title, description, id, overlay, action, children }) => {
  const titleId = useId();
  return (
    <section id={id} aria-labelledby={titleId} className="relative scroll-mt-6 bg-white rounded-[12px] border border-[#DDE2EA] shadow-[0_1px_3px_rgba(11,45,107,0.08)] p-4 @min-[768px]:p-6">
      {overlay}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          <h4 id={titleId} className="text-[16px] leading-[24px] font-semibold text-[#121722]">
            {title}
          </h4>
          {description && <p className="mt-0.5 text-[12px] leading-[16px] text-[#4B5465]">{description}</p>}
        </div>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
};

/** Two short related fields side by side from 640px (First/Last name, City/PIN code, Start/End date). */
export const FieldPair: React.FC<{ children: React.ReactNode; overlay?: React.ReactNode }> = ({ children, overlay }) => (
  <div className="relative grid grid-cols-1 @min-[640px]:grid-cols-2 gap-4">
    {overlay}
    {children}
  </div>
);
