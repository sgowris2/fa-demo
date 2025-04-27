import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const titleMap: Record<string, string> = {
  'screens/quiz': 'Quiz',
  'screens/worksheets': 'Worksheets',
  'screens/scan': 'Scan',
  index: 'Home',
};

export default function CustomHeader() {
  const navigation = useNavigation();
  const route = useRoute();

  const title = titleMap[route.name] ?? 'App';

  return (
    <View className="flex-row items-center mt-8 mb-4 ml-4 border-b border-gray-300">
      <Text className="mt-4 ml-4 font-bold" style={{ color: '#4A4A4A', fontSize: 26 }}>{title}</Text>
    </View>
  );
}
