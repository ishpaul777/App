import { NavigationContext, useFocusEffect, useNavigation, useNavigationState } from '@react-navigation/native';
import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { LayoutRectangle, NativeSyntheticEvent } from 'react-native';
import GenericTooltip from '@components/Tooltip/GenericTooltip';
import type { EducationalTooltipProps } from '@components/Tooltip/types';
import measureTooltipCoordinate from './measureTooltipCoordinate';
import { BoundsObserver } from '@react-ng/bounds-observer';
type LayoutChangeEventWithTarget = NativeSyntheticEvent<{ layout: LayoutRectangle; target: HTMLElement }>;

function BaseEducationalTooltip({ children, shouldRender = false, shouldHideOnNavigate = true, name, root, ...props }: EducationalTooltipProps) {
    const hideTooltipRef = useRef<() => void>();
    const [shouldMeasure, setShouldMeasure] = useState(false);
    const [isVisibleElement, setIsVisibleElement] = useState(false);

    const show = useRef<() => void>();

    const show = useRef<() => void>();
    const navigator = useContext(NavigationContext);

    useEffect(() => {
        return () => {
            hideTooltipRef.current?.();
        };
    }, []);

    useEffect(() => {
        if (!shouldMeasure) {
            return;
        }
        if (!shouldRender) {
            hideTooltipRef.current?.();
            return;
        }
        // When tooltip is used inside an animated view (e.g. popover), we need to wait for the animation to finish before measuring content.
        const timerID = setTimeout(() => {
            show.current?.();
        }, 500);
        return () => {
            clearTimeout(timerID);
        };
    }, [shouldMeasure, shouldRender]);

    useEffect(() => {
        if (!navigator) {
            return;
        }
        const unsubscribe = navigator.addListener('blur', () => {
            if (!shouldHideOnNavigate) {
                return;
            }
            hideTooltipRef.current?.();
        });
        return unsubscribe;
    }, [navigator, shouldHideOnNavigate]);
    const elementRef = useRef();

    const getBounds = (bounds: DOMRect): LayoutRectangle => {
        const targetElement = elementRef.current?._childNode;


        const elementAtPoint = document.elementFromPoint(bounds.x, bounds.y);
        if (elementAtPoint && 'contains' in elementAtPoint && targetElement && 'contains' in targetElement) {
            const isElementVisible =
                elementAtPoint instanceof HTMLElement &&
                (targetElement?.contains(elementAtPoint) || elementAtPoint?.contains(targetElement));
            setIsVisibleElement(isElementVisible)
        }

        return bounds;
    };

    return (
        <GenericTooltip
            shouldForceAnimate
            shouldRender={shouldRender && isVisibleElement}
            name={name}
            // intersectionObserverEntry={entry}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        >
            {({ showTooltip, hideTooltip, updateTargetBounds }) => {
                // eslint-disable-next-line react-compiler/react-compiler
                hideTooltipRef.current = hideTooltip;
                // return React.cloneElement(children as React.ReactElement, {
                //     onLayout: (e: LayoutChangeEventWithTarget) => {
                //         if (!shouldMeasure) {
                //             setShouldMeasure(true);
                //         }
                //         // e.target is specific to native, use e.nativeEvent.target on web instead
                //         const target = e.target || e.nativeEvent.target;
                //         show.current = () => measureTooltipCoordinate(target, updateTargetBounds, showTooltip);
                //     },
                // })
                return (
                    <BoundsObserver
                        enabled={shouldRender}
                        onBoundsChange={(bounds) => {
                            updateTargetBounds(getBounds(bounds));
                        }}
                        ref={elementRef}
                    >
                        {React.cloneElement(children as React.ReactElement, {
                            onLayout: (e: LayoutChangeEventWithTarget) => {
                                if (!shouldMeasure) {
                                    setShouldMeasure(true);
                                }
                                // e.target is specific to native, use e.nativeEvent.target on web instead
                                const target = e.target || e.nativeEvent.target;
                                show.current = () => measureTooltipCoordinate(target, updateTargetBounds, showTooltip);
                            },
                        })}
                    </BoundsObserver>
                )

            }}
        </GenericTooltip>
    );
}

BaseEducationalTooltip.displayName = 'BaseEducationalTooltip';

export default memo(BaseEducationalTooltip);
