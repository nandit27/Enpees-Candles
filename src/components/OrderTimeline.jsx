import React from 'react';

const OrderTimeline = ({ order }) => {
    const steps = [
        {
            key: 'placed',
            label: 'Order Pending',
            icon: 'shopping_bag',
            description: 'Your order has been received'
        },
        {
            key: 'confirmed',
            label: 'Order Confirmed',
            icon: 'verified',
            description: 'Order confirmed and being prepared'
        },
        {
            key: 'shipped',
            label: 'Shipped',
            icon: 'local_shipping',
            description: 'Order is on the way'
        },
        {
            key: 'delivered',
            label: 'Delivered',
            icon: 'check_circle',
            description: 'Order has been delivered'
        }
    ];

    const isCancelled = order.status === 'CANCELLED';
    
    const getStepStatus = (stepKey) => {
        if (isCancelled && stepKey !== 'placed') {
            return 'cancelled';
        }
        if (order.timeline && order.timeline[stepKey]?.completed) {
            return 'completed';
        }
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
            minute: '2-digit'
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {isCancelled && (
                <div className="mb-6 bg-red-500/20 border border-red-400 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-400 text-3xl">cancel</span>
                        <div>
                            <h3 className="text-red-300 font-bold text-lg">Order Cancelled</h3>
                            {order.cancellationReason && (
                                <p className="text-red-200 text-sm mt-1">Reason: {order.cancellationReason}</p>
                            )}
                            {order.timeline?.cancelled?.timestamp && (
                                <p className="text-red-300 text-xs mt-1">
                                    {formatDate(order.timeline.cancelled.timestamp)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="relative">
                {steps.map((step, index) => {
                    const status = getStepStatus(step.key);
                    const isCompleted = status === 'completed';
                    const isCancelledStep = status === 'cancelled';
                    const timestamp = order.timeline?.[step.key]?.timestamp;

                    return (
                        <div key={step.key} className="relative flex gap-6 pb-8 last:pb-0">
                            {/* Vertical Line */}
                            {index < steps.length - 1 && (
                                <div className={`absolute left-[22px] top-[44px] w-0.5 h-[calc(100%-44px)] ${
                                    isCancelledStep ? 'bg-red-400/50' : 
                                    isCompleted ? 'bg-[#D8A24A]' : 'bg-[#EAD2C0]/30'
                                }`} />
                            )}

                            {/* Icon Circle */}
                            <div className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-full border-2 flex-shrink-0 ${
                                isCancelledStep 
                                    ? 'bg-red-500/20 border-red-400' 
                                    : isCompleted 
                                        ? 'bg-[#D8A24A] border-[#D8A24A]' 
                                        : 'bg-[#FFF7ED]/10 border-[#EAD2C0]/40'
                            }`}>
                                <span className={`material-symbols-outlined ${
                                    isCancelledStep ? 'text-red-400' : 
                                    isCompleted ? 'text-white' : 'text-[#EAD2C0]/60'
                                }`} style={{ fontSize: '24px' }}>
                                    {isCancelledStep ? 'cancel' : step.icon}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className={`font-bold text-base ${
                                            isCancelledStep ? 'text-[#EAD2C0]/50' :
                                            isCompleted ? 'text-[#FFF7ED]' : 'text-[#EAD2C0]/60'
                                        }`}>
                                            {step.label}
                                        </h3>
                                        <p className={`text-sm mt-1 ${
                                            isCancelledStep ? 'text-[#EAD2C0]/40' :
                                            isCompleted ? 'text-[#EAD2C0]' : 'text-[#EAD2C0]/50'
                                        }`}>
                                            {step.description}
                                        </p>
                                        {step.key === 'shipped' && order.trackingId && (
                                            <div className="mt-2 space-y-1">
                                                <p className="text-sm text-[#FFF7ED]">
                                                    <strong>Tracking ID:</strong> {order.trackingId}
                                                </p>
                                                {order.trackingLink && (
                                                    <a 
                                                        href={order.trackingLink} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-[#D8A24A] hover:text-[#D8A24A]/80 hover:underline flex items-center gap-1"
                                                    >
                                                        Track Shipment
                                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {timestamp && (
                                        <span className={`text-xs whitespace-nowrap ${
                                            isCancelledStep ? 'text-[#EAD2C0]/40' :
                                            isCompleted ? 'text-[#EAD2C0]' : 'text-[#EAD2C0]/50'
                                        }`}>
                                            {formatDate(timestamp)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTimeline;
