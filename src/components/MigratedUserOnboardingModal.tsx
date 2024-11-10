import React from 'react';
import useLocalize from '@hooks/useLocalize';
import useResponsiveLayout from '@hooks/useResponsiveLayout';
import useStyleUtils from '@hooks/useStyleUtils';
import useThemeStyles from '@hooks/useThemeStyles';
import variables from '@styles/variables';
import CONST from '@src/CONST';
import FeatureList from './FeatureList';
import type {FeatureListItem} from './FeatureList';
import * as Illustrations from './Icon/Illustrations';
import LottieAnimations from './LottieAnimations';
import Modal from './Modal';

type DecisionModalProps = {
    /** Callback for closing modal */
    onClose: () => void;

    /** Whether modal is visible */
    isVisible: boolean;
};
const workspaceFeatures: FeatureListItem[] = [
    {
        icon: Illustrations.MoneyReceipts,
        translationKey: 'workspace.emptyWorkspace.features.trackAndCollect',
    },
    {
        icon: Illustrations.CreditCardsNew,
        translationKey: 'workspace.emptyWorkspace.features.companyCards',
    },
    {
        icon: Illustrations.MoneyWings,
        translationKey: 'workspace.emptyWorkspace.features.reimbursements',
    },
];

function MigratedUserOnboardingModal({onClose, isVisible}: DecisionModalProps) {
    const styles = useThemeStyles();
    const StyleUtils = useStyleUtils();
    const {shouldUseNarrowLayout} = useResponsiveLayout();
    const {translate} = useLocalize();

    return (
        <Modal
            onClose={onClose}
            isVisible={isVisible}
            type={shouldUseNarrowLayout ? CONST.MODAL.MODAL_TYPE.BOTTOM_DOCKED : CONST.MODAL.MODAL_TYPE.CONFIRM}
            innerContainerStyle={shouldUseNarrowLayout ? {} : {width: 500}}
        >
            <FeatureList
                menuItems={workspaceFeatures}
                title={translate('workspace.emptyWorkspace.title')}
                subtitle={translate('workspace.emptyWorkspace.subtitle')}
                ctaText={"Let's get started"}
                ctaAccessibilityLabel={"Let's get started"}
                onCtaPress={onClose}
                illustration={LottieAnimations.WorkspacePlanet}
                illustrationContainerStyle={[StyleUtils.getBorderRadiusStyle(variables.componentBorderRadiusLarge)]}
                titleStyles={styles.textHeadlineH1}
                containerStyles={[styles.bgTransparent, styles.mh2, styles.mv2, styles.noBorderRadius]}
                contentPaddingOnLargeScreens={styles.p2}
            />
        </Modal>
    );
}

MigratedUserOnboardingModal.displayName = 'MigratedUserOnboardingModal';

export default MigratedUserOnboardingModal;
