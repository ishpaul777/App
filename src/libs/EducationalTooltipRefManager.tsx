import React from 'react';

type TTooltipRef = {
    hideTooltip: () => void;
};

const tooltipRef = React.createRef<TTooltipRef>();

const EducationalTooltipRefManager = {
    ref: tooltipRef,
    hideTooltip: () => {
        tooltipRef.current?.hideTooltip();
    },
};

export default EducationalTooltipRefManager;
