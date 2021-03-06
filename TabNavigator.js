'use strict';

import Icon from 'react-native-vector-icons/Ionicons';
import { Set } from 'immutable';
import React, {
  PropTypes
} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Badge from './Badge';
import Layout from './Layout';
import StaticContainer from './StaticContainer';
import Tab from './Tab';
import TabBar from './TabBar';
import TabNavigatorItem from './TabNavigatorItem';

const DEFAULT_ICON_SIZE = 20;
const DEFAULT_ICON_COLOR = 'grey';

export default class TabNavigator extends React.Component {
  static propTypes = {
    ...View.propTypes,
    sceneStyle: View.propTypes.style,
    tabBarContainerStyle: TabBar.propTypes.style,
    tabBarStyle: View.propTypes.style,
    tabBarShadowStyle: TabBar.propTypes.shadowStyle,
    hidesTabTouch: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
  };

  static defaultProps = {
    scrollEnabled: false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      renderedSceneKeys: this._updateRenderedSceneKeys(props.children),
    };

    this._renderTab = this._renderTab.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let { renderedSceneKeys } = this.state;
    this.setState({
      renderedSceneKeys: this._updateRenderedSceneKeys(
        nextProps.children,
        renderedSceneKeys,
      ),
    });
  }

  _getSceneKey(item, index): string {
    return `scene-${(item.key !== null) ? item.key : index}`;
  }

  _updateRenderedSceneKeys(children, oldSceneKeys = Set()): Set {
    let newSceneKeys = Set().asMutable();
    React.Children.forEach(children, (item, index) => {
      if (item === null) {
        return;
      }
      let key = this._getSceneKey(item, index);
      if (oldSceneKeys.has(key) || item.props.selected) {
        newSceneKeys.add(key);
      }
    });
    return newSceneKeys.asImmutable();
  }

  render() {
    let { style, children, tabBarStyle, tabBarContainerStyle,
      tabBarShadowStyle, sceneStyle, scrollEnabled, ...props } = this.props;
    let scenes = [];

    React.Children.forEach(children, (item, index) => {
      if (item === null) {
        return;
      }
      let sceneKey = this._getSceneKey(item, index);
      if (!this.state.renderedSceneKeys.has(sceneKey)) {
        return;
      }

      let { selected } = item.props;
      let scene =
        <SceneContainer key={sceneKey} selected={selected} style={sceneStyle}>
          {item}
        </SceneContainer>;

      scenes.push(scene);
    });

    return (
      <View {...props} style={[styles.container, style]}>
        {scenes}
        <TabBar
          style={tabBarStyle}
          tabBarContainerStyle={tabBarContainerStyle}
          shadowStyle={tabBarShadowStyle}
          scrollEnabled={scrollEnabled}>
          {React.Children.map(children, this._renderTab)}
        </TabBar>
      </View>
    );
  }

  _renderVectorialIcon(item) {
    let color = item.props.iconColor;

    if (item.props.selected && item.props.iconSelectedColor) {
      color = item.props.iconSelectedColor;
    }

    if (item.props.iconName) {
      return (
        <View style={{ alignSelf: 'center' }}>
          <Icon
            name={ item.props.iconName }
            size={ item.props.iconSize || DEFAULT_ICON_SIZE }
            color={ color || DEFAULT_ICON_COLOR } />
        </View>
      );
    }
    return false;
  }

  _renderTab(item) {
    const { scrollEnabled } = this.props;
    let icon;

    if (item === null) {
        return;
    }

    if (!(icon = this._renderVectorialIcon(item))) {
      if (item.props.selected) {
        if (item.props.renderSelectedIcon) {
          icon = item.props.renderSelectedIcon();
        } else if (item.props.renderIcon) {
          let defaultIcon = item.props.renderIcon();
          icon = React.cloneElement(defaultIcon, {
            style: [defaultIcon.props.style, styles.defaultSelectedIcon],
          });
        }
      } else if (item.props.renderIcon) {
        icon = item.props.renderIcon();
      }
    }

    let badge;
    if (item.props.renderBadge) {
      badge = item.props.renderBadge();
    } else if (item.props.badgeText) {
      badge = <Badge>{item.props.badgeText}</Badge>;
    }

    return (
      <Tab
        style={[
          item.props.style,
          item.props.selected ? item.props.selectedStyle : null,
          !scrollEnabled ? { flex: 1 } : null ]}
        testID={item.props.testID}
        title={item.props.title}
        allowFontScaling={item.props.allowFontScaling}
        titleStyle={[
          item.props.titleStyle,
          item.props.selected ? [
            styles.defaultSelectedTitle,
            item.props.selectedTitleStyle,
          ] : null,
        ]}
        disabled={ item.props.disabled }
        disabledStyle={ item.props.disabledStyle }
        badge={badge}
        onPress={item.props.onPress}
        hidesTabTouch={this.props.hidesTabTouch}>
        {icon}
      </Tab>
    );
  }
}

class SceneContainer extends React.Component {
  static propTypes = {
    ...View.propTypes,
    selected: PropTypes.bool,
  };

  render() {
    let { selected, ...props } = this.props;
    return (
      <View
        {...props}
        pointerEvents={selected ? 'auto' : 'none'}
        removeClippedSubviews={!selected}
        style={[
          styles.sceneContainer,
          selected ? null : styles.hiddenSceneContainer,
          props.style,
        ]}>
        <StaticContainer shouldUpdate={selected}>
          {this.props.children}
        </StaticContainer>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sceneContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: Layout.tabBarHeight,
  },
  hiddenSceneContainer: {
    overflow: 'hidden',
    opacity: 0,
  },
  defaultSelectedTitle: {
    color: 'rgb(0, 122, 255)',
  },
  defaultSelectedIcon: {
    tintColor: 'rgb(0, 122, 255)',
  },
});

TabNavigator.Item = TabNavigatorItem;
