import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProgressCircle from "react-native-progress/Circle";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [images, setImages] = useState<string[]>([]);
  const [takingPicture, setTakingPicture] = useState(true);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState<any | null>(null);

  if (!permission) {
    console.log("Camera permission not set");
    return null;
  }

  if (!permission.granted) {
    console.log("Camera permission to be granted");
    return (
      <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-neutral-900">
        <Text className="text-lg text-center text-gray-800 dark:text-gray-200 mb-6">
          We need your permission to use the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-600 px-6 py-3 rounded-lg shadow-md active:opacity-80"
        >
          <Text className="text-white text-base font-semibold">
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      setImages((prev) => [...prev, photo.uri]);
      setTakingPicture(false);
    }
  };

  const autoGrade = async () => {
    if (images.length === 0) {
      Alert.alert("No images", "Please take at least one picture before auto-grading.");
      return;
    }

    setIsGrading(true);
    try {
      console.log("Grading images:", images);
      const response = await fetch("https://api.example.com/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });
      const result = await response.json();
      setGradingResult(result);
    } catch (error) {
      console.error("Error grading images:", error);
      Alert.alert("Error", "An error occurred while grading the images.");
    } finally {
      setIsGrading(false);
    }
  };

  const renderGradingResult = () => {
    console.log('Rendering grading result');
    if (!gradingResult) return null;

    const { score, questions, insights } = gradingResult;

    return (
      <ScrollView className="flex-1 px-6 py-8 bg-white dark:bg-neutral-900">
        <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Assessment Results
        </Text>

        {/* Circular Percent Gauge */}
        <View className="items-center mb-6">
          <ProgressCircle
            percent={score} // Use the score directly as a percentage
            radius={75} // Adjust the radius to match the size
            borderWidth={8} // Thickness of the circle
            color="#4CAF50" // Progress color
            shadowColor="#E0E0E0" // Background circle color
            bgColor="#FFFFFF" // Background color inside the circle
          >
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              {score}%
            </Text>
          </ProgressCircle>
        </View>

        {/* Questions List */}
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Questions
        </Text>
        {questions.map((question: any, index: number) => (
          <View
            key={index}
            className="flex-row justify-between items-center bg-gray-100 dark:bg-neutral-800 px-4 py-3 rounded-lg mb-2"
          >
            <Text className="text-gray-800 dark:text-gray-200">
              {question.text}
            </Text>
            <Ionicons
              name={question.correct ? "checkmark-circle" : "close-circle"}
              size={20}
              color={question.correct ? "green" : "red"}
            />
          </View>
        ))}

        {/* Insights */}
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">
          Insights
        </Text>
        <Text className="text-gray-800 dark:text-gray-200">
          {insights}
        </Text>

        {/* Scan New Worksheet Button */}
        <TouchableOpacity
          onPress={() => {
            setGradingResult(null);
            setImages([]);
            setTakingPicture(true);
          }}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-lg shadow-md active:opacity-80"
        >
          <Text className="text-white text-base font-semibold text-center">
            Scan New Worksheet
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderPictureList = () => {
    console.log(images);
    return (
      <View className="flex-1 items-center justify-center px-6 py-8 bg-white dark:bg-neutral-900">
        <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Captured Images
        </Text>
        <View className="flex-1w-full items-center justify-center">
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          className="flex-1 border border-gray-300 rounded-lg p-2"
          contentContainerStyle={{ paddingHorizontal: 8 }}
          style={{
            maxHeight: 300
          }}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              contentFit="cover"
              className="w-36 h-36 rounded-lg mx-2 my-2 shadow-md"
            />
          )}
        />
        </View>
        <View className="w-64 mb-16">
          <View className="mt-8 py-4">
          <TouchableOpacity
            onPress={() => setTakingPicture(true)}
            className="flex-row items-center justify-center bg-blue-500 px-5 py-3 rounded-md shadow active:opacity-80"
          >
            <Ionicons name="camera-outline" size={20} color="white" />
            <Text className="text-white text-xl font-bold ml-2">Scan Next Page</Text>
          </TouchableOpacity>
          </View>
          <View className="py-4">
          <TouchableOpacity
            onPress={autoGrade}
            className="flex-row items-center justify-center bg-green-600 px-5 py-3 rounded-md shadow active:opacity-80"
          >
            <Ionicons name="sparkles-outline" size={20} color="white" />
            <Text className="text-white text-xl font-bold ml-2">Start AI Grading!</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderCamera = () => {
    console.log('Rendering camera');
    return (
      <View className="flex-1 relative">
      <CameraView
        className="flex-1 w-full"
        ref={ref}
        mode="picture"
        facing="back"
        mute={true}
        responsiveOrientationWhenOrientationLocked
      >
        <View className="h-full w-full"></View>
      </CameraView>
      <View className="absolute bottom-0 left-0 right-0 items-center justify-center px-8 py-16">
          <TouchableOpacity onPress={takePicture}>
            <View className="w-24 h-24 rounded-full border-4 border-white items-center justify-center">
              <View className="w-20 h-20 rounded-full bg-white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isGrading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="text-lg font-medium text-gray-900 dark:text-white mt-4">
          Grading your worksheets, this may take a few moments...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 dark:bg-neutral-950">
      {gradingResult
        ? renderGradingResult()
        : takingPicture
          ? renderCamera()
          : renderPictureList()}
    </View>
  );
}