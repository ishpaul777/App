import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import type {ValueOf} from 'type-fest';
import Icon from '@components/Icon';
import * as Expensicons from '@components/Icon/Expensicons';
import Text from '@components/Text';
import {
    setConciergeChatTooltipViewed,
    setFilterTooltipViewed,
    setGlobalCreateTooltipViewed,
    setInboxTooltipViewed,
    setNudgeMigratedUserWelcomeModalViewed,
    setWorkspaceChatTooltipViewed,
} from '@libs/actions/Welcome';
import {hasCompletedGuidedSetupFlowSelector} from '@libs/onboardingSelectors';
import CONST from '@src/CONST';
import type {TranslationPaths} from '@src/languages/types';
import ONYXKEYS from '@src/ONYXKEYS';
import type ChildrenProps from '@src/types/utils/ChildrenProps';
import useLocalize from './useLocalize';
import useResponsiveLayout from './useResponsiveLayout';
import useTheme from './useTheme';
import useThemeStyles from './useThemeStyles';

type ProductTourElementName = ValueOf<typeof CONST.PRODUCT_TRAINING_ELEMENTS>;

type ProductTourContextType = {
    shouldRenderElement: (elementName: ProductTourElementName) => boolean;
    renderProductTourElement: (elementName: ProductTourElementName) => React.ReactNode | null;
    registerTooltip: (elementName: ProductTourElementName) => void;
    unregisterTooltip: (elementName: ProductTourElementName) => void;
};

const ProductTourContext = createContext<ProductTourContextType>({
    shouldRenderElement: () => false,
    renderProductTourElement: () => null,
    registerTooltip: () => {},
    unregisterTooltip: () => {},
});

type ShouldShowConditionProps = {
    isDismissed: boolean;
    isOnboardingCompleted: boolean;
    hasBeenAddedToNudgeMigration: boolean;
    shouldUseNarrowLayout: boolean;
};

const {NUDGE_MIGRATION_WELCOME_MODAL, FILTER_BUTTON_TOOLTIP, BOTTOM_NAV_INBOX_TOOLTIP, WORKSPACE_CHAT_LHN_TOOLTIP, GLOBAL_CREATE_TOOLTIP, CONCIERGE_GBR_TOOLTIP} =
    CONST.PRODUCT_TRAINING_ELEMENTS;

const PRODUCT_TOUR_FLOWS = {
    [NUDGE_MIGRATION_WELCOME_MODAL]: {
        text: [{translationKey: 'productTraining.welcomeModal', isBold: false}],
        onHideElement: setNudgeMigratedUserWelcomeModalViewed,
        name: NUDGE_MIGRATION_WELCOME_MODAL,
        priority: 1400,
        conflictingElements: [BOTTOM_NAV_INBOX_TOOLTIP, GLOBAL_CREATE_TOOLTIP, WORKSPACE_CHAT_LHN_TOOLTIP, FILTER_BUTTON_TOOLTIP],
        shouldShow: ({isDismissed, hasBeenAddedToNudgeMigration}: ShouldShowConditionProps) => hasBeenAddedToNudgeMigration && !isDismissed,
    },
    [CONCIERGE_GBR_TOOLTIP]: {
        text: [
            [
                {translationKey: 'productTraining.conciergeGBRTooltip.regular', isBold: false},
                {translationKey: 'productTraining.conciergeGBRTooltip.bold', isBold: true},
            ],
        ],
        onHideElement: setConciergeChatTooltipViewed,
        name: CONCIERGE_GBR_TOOLTIP,
        priority: 1300,
        conflictingElements: [BOTTOM_NAV_INBOX_TOOLTIP, GLOBAL_CREATE_TOOLTIP, WORKSPACE_CHAT_LHN_TOOLTIP],
        shouldShow: ({isDismissed, isOnboardingCompleted, hasBeenAddedToNudgeMigration, shouldUseNarrowLayout}: ShouldShowConditionProps) =>
            isOnboardingCompleted && !isDismissed && !hasBeenAddedToNudgeMigration && shouldUseNarrowLayout,
    },
    [FILTER_BUTTON_TOOLTIP]: {
        text: [
            {translationKey: 'productTraining.filterButton.bold', isBold: true},
            {translationKey: 'productTraining.filterButton.regular', isBold: false},
        ],
        onHideElement: setFilterTooltipViewed,
        name: FILTER_BUTTON_TOOLTIP,
        priority: 900,
        conflictingElements: [BOTTOM_NAV_INBOX_TOOLTIP, GLOBAL_CREATE_TOOLTIP],
        shouldShow: ({isDismissed}: ShouldShowConditionProps) => !isDismissed,
    },
    [BOTTOM_NAV_INBOX_TOOLTIP]: {
        text: [
            [
                {translationKey: 'productTraining.bottomNavInbox.bold', isBold: true},
                {translationKey: 'productTraining.bottomNavInbox.regular.part1', isBold: false},
            ],
            {translationKey: 'productTraining.bottomNavInbox.regular.part2', isBold: false},
        ],
        onHideElement: setInboxTooltipViewed,
        name: BOTTOM_NAV_INBOX_TOOLTIP,
        priority: 800,
        conflictingElements: [CONCIERGE_GBR_TOOLTIP, GLOBAL_CREATE_TOOLTIP, WORKSPACE_CHAT_LHN_TOOLTIP, FILTER_BUTTON_TOOLTIP, NUDGE_MIGRATION_WELCOME_MODAL],
        shouldShow: ({isDismissed}: ShouldShowConditionProps) => !isDismissed,
    },
    [GLOBAL_CREATE_TOOLTIP]: {
        text: [
            [
                {translationKey: 'productTraining.globalCreate.bold', isBold: true},
                {translationKey: 'productTraining.globalCreate.regular.part1', isBold: false},
            ],
            {translationKey: 'productTraining.globalCreate.regular.part2', isBold: false},
        ],
        onHideElement: setGlobalCreateTooltipViewed,
        name: GLOBAL_CREATE_TOOLTIP,
        priority: 1200,
        conflictingElements: [BOTTOM_NAV_INBOX_TOOLTIP, WORKSPACE_CHAT_LHN_TOOLTIP, CONCIERGE_GBR_TOOLTIP, FILTER_BUTTON_TOOLTIP, NUDGE_MIGRATION_WELCOME_MODAL],
        shouldShow: ({isDismissed}: ShouldShowConditionProps) => !isDismissed,
    },
    [WORKSPACE_CHAT_LHN_TOOLTIP]: {
        text: [
            {translationKey: 'productTraining.workspaceChat.regular.part1', isBold: false},
            [
                {translationKey: 'productTraining.workspaceChat.regular.part2', isBold: false},
                {translationKey: 'productTraining.workspaceChat.bold', isBold: true},
            ],
        ],
        onHideElement: setWorkspaceChatTooltipViewed,
        name: WORKSPACE_CHAT_LHN_TOOLTIP,
        conflictingElements: [BOTTOM_NAV_INBOX_TOOLTIP, GLOBAL_CREATE_TOOLTIP, CONCIERGE_GBR_TOOLTIP],
        priority: 600,
        shouldShow: ({isDismissed}: ShouldShowConditionProps) => !isDismissed,
    },
};

function ProductTourProvider({children}: ChildrenProps) {
    const [tryNewDot] = useOnyx(ONYXKEYS.NVP_TRYNEWDOT);
    const hasBeenAddedToNudgeMigration = !!tryNewDot?.nudgeMigration?.timestamp;
    const [isOnboardingCompleted = true] = useOnyx(ONYXKEYS.NVP_ONBOARDING, {
        selector: hasCompletedGuidedSetupFlowSelector,
    });
    const [dismissedProductTraining] = useOnyx(ONYXKEYS.NVP_DISMISSED_PRODUCT_TRAINING);
    const {translate} = useLocalize();
    const {shouldUseNarrowLayout} = useResponsiveLayout();
    const styles = useThemeStyles();
    const theme = useTheme();

    // Track active tooltips
    const [activeTooltips, setActiveTooltips] = useState<Set<ProductTourElementName>>(new Set());

    const unregisterTooltip = useCallback(
        (elementName: ProductTourElementName) => {
            setActiveTooltips((prev) => {
                const next = new Set(prev);
                next.delete(elementName);
                return next;
            });
        },
        [setActiveTooltips],
    );

    const determineVisibleTooltip = useCallback((): {
        visibleTooltip: ProductTourElementName | null;
    } => {
        if (activeTooltips.size === 0) {
            return {visibleTooltip: null};
        }

        const sortedTooltips = Array.from(activeTooltips)
            .map((name) => ({
                name,
                priority: PRODUCT_TOUR_FLOWS[name]?.priority ?? 0,
            }))
            .sort((a, b) => b.priority - a.priority);

        const highestPriorityTooltip = sortedTooltips.at(0);

        if (!highestPriorityTooltip) {
            return {visibleTooltip: null};
        }

        return {
            visibleTooltip: highestPriorityTooltip.name,
        };
    }, [activeTooltips]);

    const checkBaseConditions = useCallback(
        (elementName: ProductTourElementName) => {
            const isDismissed = !!dismissedProductTraining?.[elementName];

            // Early return if not eligible for any tooltips
            if (!isOnboardingCompleted && !hasBeenAddedToNudgeMigration) {
                return false;
            }

            const tooltipConfig = PRODUCT_TOUR_FLOWS[elementName];

            return tooltipConfig.shouldShow({
                isDismissed,
                isOnboardingCompleted,
                hasBeenAddedToNudgeMigration,
                shouldUseNarrowLayout,
            });
        },
        [dismissedProductTraining, hasBeenAddedToNudgeMigration, isOnboardingCompleted, shouldUseNarrowLayout],
    );

    const registerTooltip = useCallback(
        (elementName: ProductTourElementName) => {
            const shouldRegister = checkBaseConditions(elementName);
            if (!shouldRegister) {
                return;
            }
            setActiveTooltips((prev) => new Set([...prev, elementName]));
        },
        [checkBaseConditions],
    );

    const shouldRenderElement = useCallback(
        (elementName: ProductTourElementName) => {
            // First check base conditions
            const baseCondition = checkBaseConditions(elementName);
            if (!baseCondition) {
                return false;
            }
            // Then check conflicts
            const {visibleTooltip} = determineVisibleTooltip();

            // If this is the highest priority visible tooltip, show it
            if (elementName === visibleTooltip) {
                return true;
            }

            return false;
        },
        [checkBaseConditions, determineVisibleTooltip],
    );

    // Your existing renderProductTourElement implementation...
    const renderProductTourElement = useCallback(
        (elementName: ProductTourElementName) => {
            const element = PRODUCT_TOUR_FLOWS[elementName];
            if (!element) {
                return null;
            }
            return (
                <View style={[styles.alignItemsCenter, styles.flexRow, styles.justifyContentCenter, styles.flexWrap, styles.textAlignCenter, styles.gap1, styles.p2]}>
                    <Icon
                        src={Expensicons.Lightbulb}
                        fill={theme.tooltipHighlightText}
                        medium
                    />
                    <View style={[styles.flexColumn]}>
                        {element.text.map((part, index) => {
                            if (Array.isArray(part)) {
                                return (
                                    <Text
                                        style={styles.quickActionTooltipSubtitle}
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={`${elementName}-${index}`}
                                    >
                                        {part.map((subPart) => (
                                            <Text
                                                style={subPart.isBold ? [styles.quickActionTooltipSubtitle, styles.textBold] : styles.quickActionTooltipSubtitle}
                                                key={subPart.translationKey}
                                            >
                                                {translate(subPart.translationKey as TranslationPaths)}
                                            </Text>
                                        ))}
                                    </Text>
                                );
                            }
                            return (
                                <Text
                                    style={part.isBold ? [styles.quickActionTooltipSubtitle, styles.textBold] : styles.quickActionTooltipSubtitle}
                                    key={part.translationKey}
                                >
                                    {translate(part.translationKey as TranslationPaths)}
                                </Text>
                            );
                        })}
                    </View>
                </View>
            );
        },
        [
            styles.alignItemsCenter,
            styles.flexColumn,
            styles.flexRow,
            styles.flexWrap,
            styles.gap1,
            styles.justifyContentCenter,
            styles.p2,
            styles.quickActionTooltipSubtitle,
            styles.textAlignCenter,
            styles.textBold,
            theme.tooltipHighlightText,
            translate,
        ],
    );

    const contextValue = useMemo(
        () => ({
            renderProductTourElement,
            shouldRenderElement,
            registerTooltip,
            unregisterTooltip,
        }),
        [renderProductTourElement, shouldRenderElement, registerTooltip, unregisterTooltip],
    );

    return <ProductTourContext.Provider value={contextValue}>{children}</ProductTourContext.Provider>;
}

const useProductTourContext = (elementName?: ProductTourElementName) => {
    const context = useContext(ProductTourContext);
    if (!context) {
        throw new Error('useProductTourContext must be used within a ProductTourProvider');
    }

    const {shouldRenderElement, registerTooltip, unregisterTooltip} = context;
    // Register this tooltip when the component mounts and unregister when it unmounts
    useEffect(() => {
        if (elementName) {
            registerTooltip(elementName);
            return () => {
                unregisterTooltip(elementName);
            };
        }
        return undefined;
    }, [elementName, registerTooltip, unregisterTooltip]);

    const shouldShowProductTrainingElement = useMemo(() => {
        if (!elementName) {
            return false;
        }
        return shouldRenderElement(elementName);
    }, [elementName, shouldRenderElement]);

    const hideElement = useCallback(() => {
        if (!elementName) {
            return;
        }
        const element = PRODUCT_TOUR_FLOWS[elementName];
        if (element?.onHideElement) {
            element.onHideElement();
        }
        unregisterTooltip(elementName);
    }, [elementName, unregisterTooltip]);

    if (!elementName) {
        return {
            renderProductTourElement: () => null,
            hideElement: () => {},
            shouldShowProductTrainingElement: false,
        };
    }

    return {
        renderProductTourElement: () => context.renderProductTourElement(elementName),
        hideElement,
        shouldShowProductTrainingElement,
    };
};

export {ProductTourProvider};
export default useProductTourContext;
