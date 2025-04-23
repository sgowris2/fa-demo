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
  Dimensions,
} from "react-native";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ProgressCircle } from "react-native-progress/Circle";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import Constants from "expo-constants";
import FormData from "form-data";

// const uri = Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':5001') || 'localhost';
const apiUrl = `https://nice-seas-vanish.loca.lt/api/autograde`;

export default function ScanPage() {
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

  function blobToBase64(blob: Blob) {
    const reader = new FileReader()
    reader.readAsDataURL(blob)

    return new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = () => {
        resolve(String(reader?.result).split(",")[1])
      }
    })
  }

  const autoGrade = async () => {

    if (images.length === 0) {
      Alert.alert("No images", "Please take at least one picture before auto-grading.");
      return;
    }
    setIsGrading(true);
    console.log("Grading images:", images);
    try {
      const uploadImages = async () => {
        var images_in_b64 = [];
        for (const [index, image] of images.entries()) {
          const response = await fetch(image);
          const blob = await response.blob();
          const b64 = await blobToBase64(blob) as string;
          console.log("Image blob size:", blob.size);
          const mimeType = response.headers.get('Content-Type');
          let extension = 'png'; // Default to 'png' if MIME type is not recognized

          // Map MIME type to file extension
          if (mimeType === 'image/jpeg') {
            extension = 'jpg';
          } else if (mimeType === 'image/png') {
            extension = 'png';
          } else if (mimeType === 'image/webp') {
            extension = 'webp';
          }
          images_in_b64.push({ name: `image_${index + 1}.${extension}`, data: b64, type: mimeType });
        }
        console.log(apiUrl);
        const response = await axios.post(apiUrl, {
          method: 'POST', body: { images: images_in_b64 }
        });
        console.log('Response received: ', response.data);
        setGradingResult(response.data);
      }
      await uploadImages();
    } catch (error) {
      console.error(error);
    } finally {
      setIsGrading(false);
    }
  };

  const renderGradingResult = () => {
    if (!gradingResult) return null;

    // Unpack the API response
    const firstKey = Object.keys(gradingResult)[0]; // Get the first key (e.g., "1")
    const result = gradingResult[firstKey][0]; // Access the first result in the array

    // Extract relevant data
    const { answers, score, percent, student_name, subject, date, out_of } = result;

    // Format the date
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <ScrollView className="flex-1 px-6 py-8 bg-white dark:bg-neutral-900">
        {/* Header Information */}
        <Text className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
          Worksheet Results - {subject.toUpperCase()}
        </Text>
        <Text className="text-md font-semibold text-gray-900 dark:text-white mb-2">
          {student_name}
        </Text>
        <Text className="text-md font-semibold text-gray-900 dark:text-white mb-2">
          {formattedDate}
        </Text>

        {/* Circular Percent Gauge */}
        <View className="items-center mb-6">
          <ProgressCircle
            progress={percent / 100}
            size={100}
            thickness={12}
            color="#4CAF50"
            unfilledColor="#E0E0E0"
            showsText={true}
            textStyle={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#000000',
            }}
            formatText={() => `${percent}%`}
          />
        </View>

        {/* Score Information */}
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Score: {score}/{out_of}
        </Text>

        {/* Questions and Answers */}
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Questions
        </Text>
        {answers.map((answer: any, index: number) => (
          <View
            key={index}
            className="flex-row justify-between items-center bg-gray-100 dark:bg-neutral-800 px-4 py-3 rounded-lg mb-2"
          >
            <Text className="text-gray-800 dark:text-gray-200">
              Q{answer.ques_no}: {answer.answer}
            </Text>
            <Ionicons
              name={answer.is_correct ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={answer.is_correct ? 'green' : 'red'}
            />
          </View>
        ))}

        {/* Insights */}
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">
          Insights
        </Text>
        <Text className="text-gray-800 dark:text-gray-200">
          Great job! You scored {percent}%. Keep up the good work!
        </Text>

        {/* Scan New Worksheet Button */}
        <View className="flex-1 items-center justify-center w-full mt-8">
          <TouchableOpacity
            onPress={() => {
              setGradingResult(null);
              setImages([]);
              setTakingPicture(true);
            }}
            className="flex-row items-center justify-center bg-blue-600 px-5 py-3 rounded-md shadow active:opacity-80"
          >
            <Ionicons name="camera-outline" size={20} color="white" />
            <Text className="text-white text-xl font-bold ml-2">
              Scan New Worksheet
            </Text>
          </TouchableOpacity>
        </View>
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