import {Portal} from '@gorhom/portal';
import type {ForwardedRef} from 'react';
import React, {forwardRef, useMemo} from 'react';
import {View} from 'react-native';
import BaseAutoCompleteSuggestions from '@components/AutoCompleteSuggestions/BaseAutoCompleteSuggestions';
import useStyleUtils from '@hooks/useStyleUtils';
import getBottomSuggestionPadding from './getBottomSuggestionPadding';
import TransparentOverlay from './TransparentOverlay/TransparentOverlay';
import type {AutoCompleteSuggestionsPortalProps} from './types';

function AutoCompleteSuggestionsPortal<TSuggestion>(
    {left = 0, width = 0, bottom = 0, resetSuggestions = () => {}, ...props}: AutoCompleteSuggestionsPortalProps<TSuggestion>,
    ref: ForwardedRef<View>,
) {
    const StyleUtils = useStyleUtils();
    const styles = useMemo(() => StyleUtils.getBaseAutoCompleteSuggestionContainerStyle({left, width, bottom: bottom + getBottomSuggestionPadding()}), [StyleUtils, left, width, bottom]);

    if (!width) {
        return null;
    }

    return (
        <Portal hostName="suggestions">
            <TransparentOverlay resetSuggestions={resetSuggestions} />
            <View
                ref={ref}
                style={styles}
            >
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <BaseAutoCompleteSuggestions<TSuggestion>
                    width={width}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...props}
                />
            </View>
        </Portal>
    );
}

AutoCompleteSuggestionsPortal.displayName = 'AutoCompleteSuggestionsPortal';

export default forwardRef(AutoCompleteSuggestionsPortal);
