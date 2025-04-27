import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState, useEffect, useCallback, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { useFocusEffect } from '@react-navigation/native';
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

import CircularProgress from 'react-native-circular-progress-indicator';

import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import Constants from "expo-constants";
import FormData from "form-data";
import AnswerCard from "@/components/AnswerCard";
import mockData from '@/assets/demo_data/graded_report.json';
import { useRouter } from 'expo-router';

const debug_mode = true; // Set to true to enable debug mode
const apiUrl = `https://cute-friends-kneel.loca.lt/api/autograde`;


export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [images, setImages] = useState<string[]>([]);
  const [takingPicture, setTakingPicture] = useState(true);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState<any | null>(null);

  // Reset state when navigating to this tab
  useFocusEffect(
    useCallback(() => {
      // Reset grading result and images
      setGradingResult(null);
      setImages([]);
    }, [])
  );

  if (!permission) {
    console.log("Camera permission not set");
    return null;
  }

  if (!permission.granted) {
    console.log("Camera permission to be granted");
    return (
      <View className="flex-1 items-center justify-center px-6 bg-gray-100">
        <Text className="text-lg text-center text-gray-800 mb-6">
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
      ref.current?.pausePreview();
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

    setIsGrading(true);

    if (debug_mode === true) {
      console.log("Debug mode enabled. Using mock data.");
      setGradingResult(mockData);
      setIsGrading(false);
      return;
    }

    if (images.length === 0) {
      Alert.alert("No images", "Please take at least one picture before auto-grading.");
      return renderPictureList();
    }

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

  const renderCamera = () => {
    console.log('Rendering camera');
    ref.current?.resumePreview();
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
        <View className="absolute bottom-0 left-0 right-0 items-center justify-center px-8 py-28">
          <TouchableOpacity onPress={takePicture}>
            <View className="w-24 h-24 rounded-full border-4 border-white items-center justify-center">
              <View className="w-20 h-20 rounded-full bg-gray-100" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPictureList = () => {
    if (images.length === 0) {
      return renderCamera(); // Redirect to camera view if no images
    }

    return (
      <View className="flex-1 items-center justify-center bg-gray-100 px-4 py-6">
        {/* Header */}
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Captured Images
        </Text>

        {/* Image Grid */}
        <View className="w-full items-center mb-8">
          <FlatList
            data={images}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            className="flex-1 border border-gray-300 rounded-lg p-4 bg-white shadow-md"
            contentContainerStyle={{ paddingHorizontal: 8 }}
            style={{
              height: 275,
              maxHeight: 275,
              maxWidth: 400,
            }}
            renderItem={({ item, index }) => (
              <View className="relative w-24 h-24 mx-2 my-2">
                {/* Image */}
                <Image
                  source={{ uri: item }}
                  resizeMode="contain"
                  className="w-full h-full rounded-lg shadow-md"
                />
                {/* Delete Button */}
                <TouchableOpacity
                  onPress={() => {
                    const newImages = [...images];
                    newImages.splice(index, 1);
                    setImages(newImages);
                  }}
                  className="absolute top-1 right-1 bg-red-600 bg-opacity-80 rounded-full p-1"
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        {/* Scan Next Page Button */}
        <View className="mt-8">
          <TouchableOpacity
            onPress={() => setTakingPicture(true)}
            className="flex-row items-center justify-center bg-blue-500 px-6 py-3 rounded-lg shadow-md active:opacity-80"
          >
            <Ionicons name="camera-outline" size={20} color="white" />
            <Text className="text-white text-lg font-semibold ml-3">
              Scan Next Page
            </Text>
          </TouchableOpacity>
        </View>

        {/* Start AI Grading Button */}
        <View className="mt-8">
          <TouchableOpacity
            onPress={autoGrade}
            className="flex-row items-center justify-center bg-green-600 px-6 py-4 rounded-lg shadow-md active:opacity-80"
          >
            <Ionicons name="sparkles-outline" size={20} color="white" />
            <Text className="text-white text-lg font-semibold ml-3">
              Start AI Grading!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderGradingSubmitted = () => {
    return (

      <View className="flex-1 items-center justify-center bg-gray-100 px-6">
        {/* Success Icon */}
        <View className="bg-green-100 p-6 rounded-full mb-6">
          <Ionicons name="checkmark-circle-outline" size={64} color="green" />
        </View>

        {/* Success Message */}
        <Text className="text-2xl font-bold text-gray-900 text-center mb-4">
          Worksheets Submitted!
        </Text>
        <Text className="text-lg text-gray-700 text-center mb-8">
          Your worksheets have been successfully submitted for grading. You can view the results once they are ready.
        </Text>

        {/* Navigation Buttons */}
        <View className="space-y-6 px-6">
          {/* View Worksheets Button */}
          <TouchableOpacity
            onPress={() => {
              setGradingResult(null);
              setImages([]);
              router.push('/(tabs)/screens/worksheets')
            }}
            className="flex-row items-center justify-center bg-blue-600 px-6 py-4 rounded-lg shadow-md active:opacity-80"
          >
            <Ionicons name="documents-outline" size={24} color="white" />
            <Text className="text-white text-lg font-semibold ml-3">
              View Worksheets
            </Text>
          </TouchableOpacity>

          {/* Scan New Worksheet Button */}
          <TouchableOpacity
            onPress={() => {
              setGradingResult(null);
              setImages([]);
              setTakingPicture(true);
            }}
            className="flex-row items-center justify-center bg-green-600 px-6 py-4 rounded-lg shadow-md active:opacity-80"
          >
            <Ionicons name="scan-circle-outline" size={24} color="white" />
            <Text className="text-white text-lg font-semibold ml-3">
              Scan New Worksheet
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderGradingResult = () => {

    if (!gradingResult) return null;

    // Unpack the API response
    const firstKey = Object.keys(gradingResult)[0]; // Get the first key (e.g., "1")
    const result = gradingResult[firstKey][0]; // Access the first result in the array

    // Extract relevant data
    const { answers, score, percent, student_name, grade, section, subject, date, out_of, focus_areas, insights } = result;
    // Format the date
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <ScrollView className="flex-1 px-6 bg-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <View className="">

              <Text className="text-2xl font-semibold text-gray-900">
                Worksheet #{firstKey}
              </Text>
            </View>
            <Text className="self-start px-3 py-1 rounded-full bg-purple-500 text-white text-sm font-semibold mt-2">
              {subject.toUpperCase()}
            </Text>
            <Text className="text-xl text-gray-900 mt-8">
              <Text className="text-gray-500">Student: </Text>
              {`${student_name}`}
            </Text>
            <Text className="text-xl text-gray-900">
              <Text className="text-gray-500">Class: </Text>
              {`${grade}-${section}`}
            </Text>
            <Text className="text-xl text-gray-900">
              <Text className="text-gray-500">Date: </Text>
              {formattedDate}
            </Text>
          </View>

          <View className='items-center justify-center'>
            <View className="mx-4 mb-4">
              <CircularProgress
                value={percent}
                showProgressValue={false}
                duration={1500}
                maxValue={100}
                radius={53}
                inActiveStrokeColor={'#d3d3d3'}
                inActiveStrokeWidth={25}
                activeStrokeWidth={25}
                activeStrokeColor={
                  percent < 30
                    ? 'red'
                    : percent < 60
                      ? 'orange'
                      : percent < 80
                        ? 'blue'
                        : 'green'
                }
                inActiveStrokeOpacity={0.2}
                progressValueColor={'#fff'}
                title={score.toString()}
                titleColor={'#000'}
                titleStyle={{ fontSize: 28 }}
                subtitle={`out of ${out_of}`}
                subtitleColor={'#000'}
                subtitleStyle={{ fontSize: 14 }}
              />
            </View>
          </View>
        </View>

        {/* Questions and Answers */}
        <View className="mt-8 mb-1">
          <Text className="text-xl font-semibold text-gray-900 mb-4">
            Responses
          </Text>

          {answers.map((answer: any, index: number) => (
            <AnswerCard key={index} answer={answer} />
          ))}
        </View>

        <View className="mt-2 mb-1">
          {/* Focus Areas */}
          <Text className="text-xl font-semibold text-gray-900 mt-4 mb-4">
            Focus Areas
          </Text>
          {focus_areas.length > 0 ? (
            focus_areas.map((item: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => (
              <View
                key={index}
                className="bg-white px-4 py-3 rounded-lg mb-2"
              >
                <Text className="text-gray-800">{item}</Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-800">
              No focus areas identified.
            </Text>
          )}

        </View>


        <View className="mt-2 mb-1">
          <Text className="text-xl font-semibold text-gray-900 mt-4 mb-4">
            Insights
          </Text>
          <Text className="text-gray-800 mb-2">
            {insights}
          </Text>
        </View>

        {/* Scan New Worksheet Button */}
        <View className="flex-1 items-center justify-center w-full mt-8 mb-32">
          <TouchableOpacity
            onPress={() => {
              setGradingResult(null);
              setImages([]);
              setTakingPicture(true);
            }}
            className="flex-row items-center justify-center bg-blue-600 px-5 py-3 rounded-md shadow active:opacity-80"
          >
            <Ionicons name="camera-outline" size={20} color="white" />
            <Text className="text-white text-lg font-semibold ml-4">
              Scan New Worksheet
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  if (isGrading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="text-lg font-medium text-gray-900 mt-4">
          Grading your worksheets, this may take a few moments...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {gradingResult
        ? renderGradingSubmitted()
        : takingPicture
          ? renderCamera()
          : renderPictureList()}
    </View>
  );
}