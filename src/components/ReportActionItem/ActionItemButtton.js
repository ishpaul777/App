import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import _ from 'underscore';
import Button from '@components/Button';
import useThemeStyles from '@hooks/useThemeStyles';

const propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            isPrimary: PropTypes.bool,
            onPress: PropTypes.func.isRequired,
            text: PropTypes.string.isRequired,
        }),
    ).isRequired,
};

function ActionItemButttons(props) {
    const styles = useThemeStyles();
    console.log('ActionItemButttons', props.action);
    return (
        <View style={[styles.flexRow, styles.gap4]}>
            {_.map(props.items, (item, index) => (
                <Button
                    key={`${item.text}-${index}`}
                    style={[styles.mt2]}
                    onPress={item.onPress}
                    text={item.text}
                    small
                    success={item.isPrimary}
                />
            ))}
        </View>
    );
}

ActionItemButttons.propTypes = propTypes;
ActionItemButttons.displayName = 'ActionItemButtton';

export default ActionItemButttons;
