import React from 'react';

const STEPS = [
    { key: 'placed', label: 'Received', icon: 'shopping_bag', description: 'We have the order' },
    { key: 'confirmed', label: 'Confirmed', icon: 'verified', description: 'The studio is pouring it' },
    { key: 'shipped', label: 'Shipped', icon: 'local_shipping', description: 'On the way to you' },
    { key: 'delivered', label: 'Delivered', icon: 'check_circle', description: 'Left at your door' },
];

const OrderTimeline = ({ order }) => {
    const isCancelled = order.status === 'CANCELLED';

    const getStepStatus = (stepKey) => {
        if (isCancelled && stepKey !== 'placed') return 'cancelled';
        if (order.timeline && order.timeline[stepKey]?.completed) return 'completed';
        return 'pending';
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="w-full">
            {isCancelled && (
                <div className="mb-6 rounded-[12px] bg-[#EDE0C8] p-4">
                    <p className="font-jost text-sm font-semibold text-[#4A2A1A]">Order cancelled</p>
                    {order.cancellationReason && (
                        <p className="mt-1 font-jost text-sm text-[#4A2A1A]/70">{order.cancellationReason}</p>
                    )}
                    {order.timeline?.cancelled?.timestamp && (
                        <p className="mt-1 font-jost text-xs text-[#4A2A1A]/70">
                            {formatDate(order.timeline.cancelled.timestamp)}
                        </p>
                    )}
                </div>
            )}

            <ol className="relative">
                {STEPS.map((step, index) => {
                    const status = getStepStatus(step.key);
                    const isCompleted = status === 'completed';
                    const isCancelledStep = status === 'cancelled';
                    const timestamp = order.timeline?.[step.key]?.timestamp;

                    return (
                        <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                            {index < STEPS.length - 1 && (
                                <span
                                    className={`absolute left-[17px] top-[38px] h-[calc(100%-38px)] w-px ${
                                        isCompleted ? 'bg-[#4A2A1A]' : 'bg-[#4A2A1A]/20'
                                    }`}
                                    aria-hidden="true"
                                />
                            )}
                            <div
                                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                    isCancelledStep
                                        ? 'border border-[#4A2A1A]/40 bg-transparent'
                                        : isCompleted
                                          ? 'bg-[#4A2A1A] text-[#FAF6EF]'
                                          : 'border border-[#4A2A1A]/35 bg-transparent text-[#4A2A1A]/50'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                                    {isCancelledStep ? 'close' : step.icon}
                                </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-0.5">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p
                                            className={`font-jost text-sm ${
                                                isCompleted ? 'text-[#4A2A1A]' : 'text-[#4A2A1A]/60'
                                            }`}
                                        >
                                            {step.label}
                                        </p>
                                        <p className="mt-1 font-jost text-sm text-[#4A2A1A]/70">{step.description}</p>
                                        {step.key === 'shipped' && order.trackingId && (
                                            <p className="mt-2 break-all font-jost text-xs text-[#4A2A1A]/70">
                                                Tracking {order.trackingId}
                                            </p>
                                        )}
                                    </div>
                                    {timestamp && (
                                        <p className="shrink-0 font-jost text-xs text-[#4A2A1A]/70 sm:pt-1">
                                            {formatDate(timestamp)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default OrderTimeline;
