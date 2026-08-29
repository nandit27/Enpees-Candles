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
                <div className="mb-6 rounded-[12px] bg-[#2A1D15]/60 p-4">
                    <p className="font-jost text-sm font-semibold text-[#EDE6D8]">Order cancelled</p>
                    {order.cancellationReason && (
                        <p className="mt-1 font-jost text-sm text-[#C7BCA8]">{order.cancellationReason}</p>
                    )}
                    {order.timeline?.cancelled?.timestamp && (
                        <p className="mt-1 font-jost text-xs text-[#C7BCA8]">
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
                                        isCompleted ? 'bg-[#D3A34E]' : 'bg-[#C7BCA8]/25'
                                    }`}
                                    aria-hidden="true"
                                />
                            )}
                            <div
                                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                    isCancelledStep
                                        ? 'border border-[#C7BCA8]/40 bg-transparent'
                                        : isCompleted
                                          ? 'bg-[#D3A34E] text-[#2A1D15]'
                                          : 'border border-[#C7BCA8]/35 bg-transparent text-[#C7BCA8]/50'
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
                                                isCompleted ? 'text-[#EDE6D8]' : 'text-[#C7BCA8]/60'
                                            }`}
                                        >
                                            {step.label}
                                        </p>
                                        <p className="mt-1 font-jost text-sm text-[#C7BCA8]">{step.description}</p>
                                        {step.key === 'shipped' && order.trackingId && (
                                            <p className="mt-2 break-all font-jost text-xs text-[#C7BCA8]">
                                                Tracking {order.trackingId}
                                            </p>
                                        )}
                                    </div>
                                    {timestamp && (
                                        <p className="shrink-0 font-jost text-xs text-[#C7BCA8] sm:pt-1">
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
