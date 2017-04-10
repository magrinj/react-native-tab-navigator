'use strict';

import NativeButton from './NativeButton';

import React, {PropTypes} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Layout from './Layout';

export default class Tab extends React.Component {
  static propTypes = {
    style: Text.propTypes.style,
    testID: PropTypes.string,
    title: PropTypes.string,
    titleStyle: Text.propTypes.style,
    badge: PropTypes.element,
    onPress: PropTypes.func,
    hidesTabTouch: PropTypes.bool,
    allowFontScaling: PropTypes.bool,
    disabled: PropTypes.bool,
    disabledStyle: Text.propTypes.style,
  };

  constructor(props, context) {
    super(props, context);

    this._handlePress = this._handlePress.bind(this);
  }

  render() {
    let { title, badge, disabled, disabledStyle } = this.props;
    let icon = React.Children.only(this.props.children); 

    if (title) {
      title =
        <Text
          numberOfLines={1}
          allowFontScaling={!!this.props.allowFontScaling}
          style={[styles.title, this.props.titleStyle]}>
          {title}
        </Text>;
    }

    if (badge) {
      badge = React.cloneElement(badge, {
        style: [styles.badge, badge.props.style],
      });
    }

    let tabStyle = [
      styles.container,
      this.props.style,
    ];
    return (
      <NativeButton
        testID={this.props.testID}
        activeOpacity={this.props.hidesTabTouch ? 1.0 : 0.8}
        onPress={this._handlePress}
        disabled={ disabled }
        disabledStyle={ disabledStyle }
        style={ tabStyle }>
        <View style={ styles.row }>
          <View style={ styles.col }>
            {icon}
            {title}
          </View>
          {badge}
        </View>
      </NativeButton>
    );
  }

  _handlePress(event) {
    if (this.props.onPress) {
      this.props.onPress(event);
    }
  }
}

let styles = StyleSheet.create({
  col: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#929292',
    fontSize: 10,
    textAlign: 'center',
    alignSelf: 'stretch',
    marginTop: 4,
    marginBottom: 1 + Layout.pixel,
  },
});
