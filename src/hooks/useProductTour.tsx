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

const {NUDGE_MIGRATION_WELCOME_MODAL, FILTER_BUTTON_TOOLTIP, BOTTOM_NAV_INBOX_TOOLTIP, WORKSPACE_CHAT_LHN_TOOLTIP, GLOBAL_CREATE_TOOLTIP, CONCIERGE_GBR_TOOLTIP} =
    CONST.PRODUCT_TRAINING_ELEMENTS;

const PRODUCT_TOUR_FLOWS = {
    [NUDGE_MIGRATION_WELCOME_MODAL]: {
        text: [{translationKey: 'productTraining.welcomeModal', isBold: false}],
        onHideElement: setNudgeMigratedUserWelcomeModalViewed,
        name: NUDGE_MIGRATION_WELCOME_MODAL,
        priority: 1400,
        conflictingElements: [BOTTOM_NAV_INBOX_TOOLTIP, GLOBAL_CREATE_TOOLTIP, WORKSPACE_CHAT_LHN_TOOLTIP, FILTER_BUTTON_TOOLTIP],
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
        shouldShowForNewUserOnly: true,
        shouldShowOnNarrowLayoutOnly: true,
        priority: 1300,
        conflictingElements: [BOTTOM_NAV_INBOX_TOOLTIP, GLOBAL_CREATE_TOOLTIP, WORKSPACE_CHAT_LHN_TOOLTIP],
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
    },
};

const tooltipNames = {
    shouldShowConciergeGBRTooltip: CONCIERGE_GBR_TOOLTIP,
    shouldShowMigratedUserOnboardingModal: NUDGE_MIGRATION_WELCOME_MODAL,
    shouldShowFilterButtonTooltip: FILTER_BUTTON_TOOLTIP,
    shouldShowBottomNavInboxTooltip: BOTTOM_NAV_INBOX_TOOLTIP,
    shouldShowWorkspaceChatLhnTooltip: WORKSPACE_CHAT_LHN_TOOLTIP,
    shouldShowGlobalCreateTooltip: GLOBAL_CREATE_TOOLTIP,
};

function ProductTourProvider({children}: ChildrenProps) {
    const [tryNewDot] = useOnyx(ONYXKEYS.NVP_TRYNEWDOT);
    const hasBeenAddedToNudgeMigration = !!tryNewDot?.nudgeMigration?.timestamp;
    const [isFirstTimeNewExpensifyUser] = useOnyx(ONYXKEYS.NVP_IS_FIRST_TIME_NEW_EXPENSIFY_USER);
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

    const unregisterTooltip = useCallback((elementName: ProductTourElementName) => {
        setActiveTooltips((prev) => {
            const next = new Set(prev);
            next.delete(elementName);
            return next;
        });
    }, []);

    const determineVisibleTooltip = useCallback((): {
        visibleTooltip: ProductTourElementName | null;
        conflictingElements: ProductTourElementName[];
    } => {
        if (activeTooltips.size === 0) {
            return {visibleTooltip: null, conflictingElements: []};
        }

        const sortedTooltips = Array.from(activeTooltips)
            .map((name) => ({
                name,
                priority: PRODUCT_TOUR_FLOWS[name]?.priority ?? 0,
            }))
            .sort((a, b) => b.priority - a.priority);

        const highestPriorityTooltip = sortedTooltips.at(0);

        if (!highestPriorityTooltip) {
            return {visibleTooltip: null, conflictingElements: []};
        }

        const tooltipConfig = PRODUCT_TOUR_FLOWS[highestPriorityTooltip.name];

        return {
            visibleTooltip: highestPriorityTooltip.name,
            conflictingElements: tooltipConfig?.conflictingElements ?? [],
        };
    }, [activeTooltips]);

    const checkBaseConditions = useCallback(
        (elementName: ProductTourElementName) => {
            // Early returns for base validation
            const isDismissed = dismissedProductTraining?.[elementName];
            const isEligibleForOnboarding = isFirstTimeNewExpensifyUser && isOnboardingCompleted;

            // Check if user is eligible for any tooltips
            if (!isEligibleForOnboarding && !hasBeenAddedToNudgeMigration) {
                return false;
            }

            // Special case for migration modal
            if (elementName === NUDGE_MIGRATION_WELCOME_MODAL) {
                return !!(hasBeenAddedToNudgeMigration && !isDismissed);
            }

            const tooltipConfig = PRODUCT_TOUR_FLOWS[elementName];
            const isNewUserTooltip = 'shouldShowForNewUserOnly' in tooltipConfig && tooltipConfig.shouldShowForNewUserOnly;

            // If not a new user tooltip, just check if it's dismissed
            if (!isNewUserTooltip) {
                return !isDismissed;
            }

            // For new user tooltips, check additional conditions
            const baseConditions = isEligibleForOnboarding && !isDismissed && !hasBeenAddedToNudgeMigration;

            // Check narrow layout condition if applicable
            return tooltipConfig.shouldShowOnNarrowLayoutOnly ? baseConditions && shouldUseNarrowLayout : baseConditions;
        },
        [dismissedProductTraining, hasBeenAddedToNudgeMigration, isFirstTimeNewExpensifyUser, isOnboardingCompleted, shouldUseNarrowLayout],
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
            const {visibleTooltip, conflictingElements} = determineVisibleTooltip();

            // If this is the highest priority visible tooltip, show it
            if (elementName === visibleTooltip) {
                return true;
            }

            // If this conflicts with the visible tooltip,
            // check if any of the conflicting elements are visible
            if (conflictingElements.includes(elementName)) {
                return false;
            }

            return true;
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

const useProductTourContext = (elementName: ProductTourElementName) => {
    const context = useContext(ProductTourContext);
    if (!context) {
        throw new Error('useProductTourContext must be used within a ProductTourProvider');
    }
    const {shouldRenderElement, registerTooltip, unregisterTooltip} = context;
    // Register this tooltip when the component mounts and unregister when it unmounts
    useEffect(() => {
        if (elementName) {
            registerTooltip(elementName);
            return () => unregisterTooltip(elementName);
        }
        return undefined;
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementName, registerTooltip, unregisterTooltip]);

    const tooltipStates = useMemo<Record<keyof typeof tooltipNames, boolean>>(() => {
        return Object.fromEntries(Object.entries(tooltipNames).map(([key, value]) => [key, shouldRenderElement(value)])) as Record<keyof typeof tooltipNames, boolean>;
    }, [shouldRenderElement]);

    const hideElement = useCallback(() => {
        const element = PRODUCT_TOUR_FLOWS[elementName];
        if (element?.onHideElement) {
            element.onHideElement();
        }
        unregisterTooltip(elementName);
    }, [elementName, unregisterTooltip]);

    return {
        renderProductTourElement: () => context.renderProductTourElement(elementName),
        hideElement,
        ...tooltipStates,
    };
};

export {ProductTourProvider};
export default useProductTourContext;
