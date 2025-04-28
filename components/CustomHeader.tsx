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
  const includeBackButton = true;
  const onPressAction = () => {}

  return (
    <View className="flex-row items-center mb-4 ml-2 border-b border-gray-300">
      {includeBackButton && (
      <TouchableOpacity
        onPress={() => {onPressAction();}}
        className=""
        style={{ paddingLeft: 4, paddingRight: 16, borderRadius: 50 }}
      >
        <Ionicons name="chevron-back" size={24} color={Colors.primary} />
      </TouchableOpacity>
      )}
      <Text className="font-bold" style={{ color: '#4A4A4A', fontSize: 26, paddingVertical: 36}}>{title}</Text>
    </View>
  );
}
