import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importe suas telas aqui (ajuste os caminhos conforme seu projeto)
import HomeScreen from './HomeScreen';
import PresencasScreen from './PresencasScreen';
import RelatoriosScreen from './RelatoriosScreen';
import PerfilScreen from './PerfilScreen';
import RankingScreen from './RankingScreen';

const Tab = createBottomTabNavigator();

const colors = {
  primaryContainer: '#4d8eff',
  onPrimaryContainer: '#00285d',
  onSurfaceVariant: '#c2c6d6',
  outlineVariant: '#424754',
};

// Nosso componente customizado que vai substituir a barra manual
function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.bottomNav}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // A mágica acontece aqui: ele navega para a tela correta
            navigation.navigate(route.name);
          }
        };

        // Definindo qual ícone renderizar baseado no nome da rota
        let icon = '';
        if (route.name === 'Home') icon = '⌂';
        if (route.name === 'Presencas') icon = '📡';
        if (route.name === 'Relatorios') icon = '📊';
        if (route.name === 'Ranking') icon = '★';
        if (route.name === 'Perfil') icon = '♙';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.navItem, isFocused && styles.navItemActive]}
          >
            <Text style={isFocused ? styles.navIconActive : styles.navIcon}>
              {icon}
            </Text>
            <Text style={isFocused ? styles.navTextActive : styles.navText}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabRoutes() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }} // Esconde o cabeçalho padrão
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="Presencas" component={PresencasScreen} options={{ tabBarLabel: 'Presença' }} />
      <Tab.Screen name="Relatorios" component={RelatoriosScreen} options={{ tabBarLabel: 'Relatórios' }} />
      <Tab.Screen name="Ranking" component={RankingScreen} options={{ tabBarLabel: 'Ranking' }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}

// Seus estilos exatos da barra inferior
const styles = StyleSheet.create({
  bottomNav: {
    height: 86,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    backgroundColor: '#171a22',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 14,
  },
  navItem: {
    minWidth: 54,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    minWidth: 88,
    borderRadius: 32,
    backgroundColor: colors.primaryContainer,
  },
  navIcon: {
    color: colors.onSurfaceVariant,
    fontSize: 23,
    fontWeight: '900',
  },
  navIconActive: {
    color: colors.onPrimaryContainer,
    fontSize: 23,
    fontWeight: '900',
  },
  navText: {
    color: colors.onSurfaceVariant,
    fontSize: 15,
    fontWeight: '800',
  },
  navTextActive: {
    color: colors.onPrimaryContainer,
    fontSize: 14,
    fontWeight: '800',
  },
});