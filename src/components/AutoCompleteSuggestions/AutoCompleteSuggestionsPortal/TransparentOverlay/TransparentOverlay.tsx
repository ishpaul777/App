import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import type {PointerEvent} from 'react-native';
import type PressableProps from '@components/Pressable/GenericPressable/types';
import PressableWithoutFeedback from '@components/Pressable/PressableWithoutFeedback';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import CONST from '@src/CONST';

type TransparentOverlayProps = {
    onPress: () => void;
    targetBounds?: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
    shouldTargetBePressable?: boolean;
};

type OnPressHandler = PressableProps['onPress'];

function TransparentOverlay({onPress: onPressProp, targetBounds, shouldTargetBePressable}: TransparentOverlayProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const onPress = useCallback<NonNullable<OnPressHandler>>(
        (event) => {
            event?.preventDefault();
            onPressProp();
        },
        [onPressProp],
    );

    const handlePointerDown = useCallback((e: PointerEvent) => {
        e?.preventDefault();
    }, []);

    // Overlay style with a semi-transparent background color
    const overlayStyle = useMemo(
        () => ({
            backgroundColor: 'rgba(0, 0, 0, 0.005)', // Adjust opacity as needed
        }),
        [],
    );

    // if (shouldTargetBePressable && targetBounds) {
    //     // one view left side of the target bounds to the left edge of the screen
    //     // one view right side of the target bounds to the right edge of the screen
    //     // one view top side of the target bounds to the top edge of the screen
    //     // one view bottom side of the target bounds to the bottom edge of the screen
    //     // The views are transparent and should be pressable
    //     // the hole in the middle should be empty content underneath should be pressable

    //     const topViewStyle = {
    //         position: 'absolute' as const,
    //         top: 0,
    //         left: 0,
    //         right: 0,
    //         height: targetBounds.top,
    //         ...overlayStyle,
    //     };
    //     const middleleftViewStyle = {
    //         position: 'absolute' as const,
    //         top: targetBounds.top,
    //         left: 0,
    //         width: targetBounds.left,
    //         height: targetBounds.height,
    //         ...overlayStyle,
    //     };

    //     const middleRightViewStyle = {
    //         position: 'absolute' as const,
    //         top: targetBounds.top,
    //         left: targetBounds.left + targetBounds.width,
    //         right: 0,
    //         height: targetBounds.height,
    //         ...overlayStyle,
    //     };

    //     const bottomViewStyle = {
    //         position: 'absolute' as const,
    //         top: targetBounds.top + targetBounds.height,
    //         left: 0,
    //         right: 0,
    //         bottom: 0,
    //         ...overlayStyle,
    //     };

    //     return (
    //         <>
    //             <View
    //                 style={topViewStyle}
    //                 onPointerDown={handlePointerDown}
    //             >
    //                 <PressableWithoutFeedback
    //                     onPress={onPress}
    //                     accessibilityLabel={translate('common.close')}
    //                     role={CONST.ROLE.BUTTON}
    //                 />
    //             </View>
    //             <View
    //                 style={middleleftViewStyle}
    //                 onPointerDown={handlePointerDown}
    //             >
    //                 <PressableWithoutFeedback
    //                     onPress={onPress}
    //                     accessibilityLabel={translate('common.close')}
    //                     role={CONST.ROLE.BUTTON}
    //                 />
    //             </View>
    //             <View
    //                 style={middleRightViewStyle}
    //                 onPointerDown={handlePointerDown}
    //             >
    //                 <PressableWithoutFeedback
    //                     onPress={onPress}
    //                     accessibilityLabel={translate('common.close')}
    //                     role={CONST.ROLE.BUTTON}
    //                 />
    //             </View>
    //             <View
    //                 style={bottomViewStyle}
    //                 onPointerDown={handlePointerDown}
    //             >
    //                 <PressableWithoutFeedback
    //                     onPress={onPress}
    //                     accessibilityLabel={translate('common.close')}
    //                     role={CONST.ROLE.BUTTON}
    //                 />
    //             </View>
    //         </>
    //     );
    // }

    return (
        <View
            onPointerDown={handlePointerDown}
            style={styles.fullScreen}
        >
            <PressableWithoutFeedback
                onPress={onPress}
                style={[styles.flex1, styles.cursorDefault, overlayStyle]}
                accessibilityLabel={translate('common.close')}
                role={CONST.ROLE.BUTTON}
            />
        </View>
    );
}

export default TransparentOverlay;
