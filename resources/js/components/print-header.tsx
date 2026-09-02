import React from 'react';

type PrintHeaderProps = {
    institutionName?: string;
    reportTitle: string;
    subTitle?: string;
    metaInfo?: Array<{ label: string; value: string | number }>;
};

export function PrintHeader({
    institutionName = 'EduSaaS Management System',
    reportTitle,
    subTitle,
    metaInfo = [],
}: PrintHeaderProps) {
    const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="hidden print:block mb-6 border-b pb-4 border-slate-300">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">{institutionName}</h1>
                    <h2 className="text-base font-semibold text-slate-700 mt-0.5">{reportTitle}</h2>
                    {subTitle && <p className="text-xs text-slate-500 mt-0.5">{subTitle}</p>}
                </div>
                <div className="text-right text-xs text-slate-500">
                    <p>Printed on: <span className="font-medium text-slate-700">{formattedDate}</span></p>
                    {metaInfo.map((m, idx) => (
                        <p key={idx} className="mt-0.5">
                            {m.label}: <span className="font-medium text-slate-700">{m.value}</span>
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function PrintSignatureFooter() {
    return (
        <div className="hidden print:flex justify-between items-end mt-12 pt-8 text-xs text-slate-600">
            <div className="text-center">
                <div className="w-40 border-t border-slate-400 pt-1 font-medium">Prepared By</div>
            </div>
            <div className="text-center">
                <div className="w-40 border-t border-slate-400 pt-1 font-medium">Verified / Checked By</div>
            </div>
            <div className="text-center">
                <div className="w-40 border-t border-slate-400 pt-1 font-medium">Authorized Signature</div>
            </div>
        </div>
    );
}
