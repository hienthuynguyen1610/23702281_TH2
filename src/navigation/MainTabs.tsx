import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '@constants/theme';
import { VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';
import { ShopStack } from '@navigation/ShopStack';
import { CartScreen } from '@screens/CartScreen';
import { MeScreen } from '@screens/MeScreen';

export type MainTabsParamList = {
  ShopTab: undefined;
  CartTab: undefined;
  MeTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs: React.FC = () => {
  const totalQuantity = useCartStore((state) => state.totalQuantity());

  const shopScreen = (
    <Tab.Screen
      key="ShopTab"
      name="ShopTab"
      component={ShopStack}
      options={{
        tabBarLabel: 'Cửa hàng',
      }}
    />
  );

  const cartScreen = (
    <Tab.Screen
      key="CartTab"
      name="CartTab"
      component={CartScreen}
      options={{
        tabBarLabel: 'Giỏ',
        tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
        tabBarBadgeStyle: {
          backgroundColor: theme.secondary,
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    />
  );

  const meScreen = (
    <Tab.Screen
      key="MeTab"
      name="MeTab"
      component={MeScreen}
      options={{
        tabBarLabel: 'Tôi',
      }}
    />
  );

  // Thứ tự tab theo VARIANT: shopFirst hay cartFirst
  const tabsInOrder =
    VARIANT.tabOrder === 'cartFirst'
      ? [cartScreen, shopScreen, meScreen]
      : [shopScreen, cartScreen, meScreen];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textLight,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '700',
        },
      }}
    >
      {tabsInOrder}
    </Tab.Navigator>
  );
};

export default MainTabs;
