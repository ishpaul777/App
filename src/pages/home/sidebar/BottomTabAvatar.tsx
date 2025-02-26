import React from 'react';
import {useOnyx} from 'react-native-onyx';
import {PressableWithFeedback} from '@components/Pressable';
import {useProductTrainingContext} from '@components/ProductTrainingContext';
import Text from '@components/Text';
import EducationalTooltip from '@components/Tooltip/EducationalTooltip';
import useCurrentUserPersonalDetails from '@hooks/useCurrentUserPersonalDetails';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import variables from '@styles/variables';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import AvatarWithDelegateAvatar from './AvatarWithDelegateAvatar';
import AvatarWithOptionalStatus from './AvatarWithOptionalStatus';
import ProfileAvatarWithIndicator from './ProfileAvatarWithIndicator';

type BottomTabAvatarProps = {
    /** Whether the avatar is selected */
    isSelected?: boolean;

    /** Function to call when the avatar is pressed */
    onPress: () => void;

    /** Whether the tooltip is allowed */
    isTooltipAllowed?: boolean;
};

function BottomTabAvatar({onPress, isSelected = false, isTooltipAllowed = false}: BottomTabAvatarProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const [account] = useOnyx(ONYXKEYS.ACCOUNT);
    const delegateEmail = account?.delegatedAccess?.delegate ?? '';
    const currentUserPersonalDetails = useCurrentUserPersonalDetails();
    const emojiStatus = currentUserPersonalDetails?.status?.emojiCode ?? '';
    const {
        renderProductTrainingTooltip: renderAccountSettingsTooltip,
        shouldShowProductTrainingTooltip: shouldShowAccountSettingsTooltip,
        hideProductTrainingTooltip: hideAccountSettingsTooltip,
    } = useProductTrainingContext(CONST.PRODUCT_TRAINING_TOOLTIP_NAMES.BOTTOM_NAV_ACCOUNT_SETTINGS_TOOLTIP, isTooltipAllowed && !isSelected);

    let children;

    if (delegateEmail) {
        children = (
            <AvatarWithDelegateAvatar
                delegateEmail={delegateEmail}
                isSelected={isSelected}
                containerStyle={styles.sidebarStatusAvatarWithEmojiContainer}
            />
        );
    } else if (emojiStatus) {
        children = (
            <AvatarWithOptionalStatus
                emojiStatus={emojiStatus}
                isSelected={isSelected}
                containerStyle={styles.sidebarStatusAvatarWithEmojiContainer}
            />
        );
    } else {
        children = (
            <ProfileAvatarWithIndicator
                isSelected={isSelected}
                containerStyles={styles.tn0Half}
            />
        );
    }

    return (
        <EducationalTooltip
            shouldRender={shouldShowAccountSettingsTooltip}
            renderTooltipContent={renderAccountSettingsTooltip}
            wrapperStyle={styles.productTrainingTooltipWrapper}
            anchorAlignment={{
                horizontal: CONST.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                vertical: CONST.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            }}
            shiftHorizontal={variables.bottomTabAccountSettingsTooltipShiftHorizontal}
            shouldHideOnNavigate={false}
            onTooltipPress={() => {
                hideAccountSettingsTooltip();
                onPress();
            }}
        >
            <PressableWithFeedback
                onPress={() => {
                    hideAccountSettingsTooltip();
                    onPress();
                }}
                role={CONST.ROLE.BUTTON}
                accessibilityLabel={translate('sidebarScreen.buttonMySettings')}
                wrapperStyle={styles.flex1}
                style={[styles.bottomTabBarItem]}
            >
                {children}
                <Text style={[styles.textSmall, styles.textAlignCenter, isSelected ? styles.textBold : styles.textSupporting, styles.mt0Half, styles.bottomTabBarLabel]}>
                    {translate('common.settings')}
                </Text>
            </PressableWithFeedback>
        </EducationalTooltip>
    );
}

BottomTabAvatar.displayName = 'BottomTabAvatar';
export default BottomTabAvatar;
