'use strict';

import React, {
  PropTypes,
} from 'react';

import {
  Text,
  Image,
  View,
} from 'react-native';

export default class TabNavigatorItem extends React.Component {
  static propTypes = {
    style: Text.propTypes.style,
    selectedStyle: Text.propTypes.style,
    disabledStyle: Text.propTypes.style,
    renderIcon: PropTypes.func,
    renderSelectedIcon: PropTypes.func,
    badgeText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    renderBadge: PropTypes.func,
    title: PropTypes.string,
    titleStyle: Text.propTypes.style,
    selectedTitleStyle: Text.propTypes.style,
    tabStyle: View.propTypes.style,
    selected: PropTypes.bool,
    onPress: PropTypes.func,
    iconName: PropTypes.string,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string,
    iconSelectedColor: PropTypes.string,
    allowFontScaling: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    renderIcon: () => <Image source={{ uri: 'null' }} />, 
  };

  render() {
    let child = React.Children.only(this.props.children);
    return React.cloneElement(child, {
      style: [child.props.style, this.props.style],
    });
  }
}
