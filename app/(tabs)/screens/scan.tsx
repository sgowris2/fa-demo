import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState, useEffect } from "react";
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

  const debug_mode = true; // Set to true to enable debug mode
  const autoGrade = async () => {

    setIsGrading(true);

    if (debug_mode === true) {
      console.log("Debug mode enabled. Using mock data.");
      setGradingResult({
        "1": [
          {
            answers: [
              { ques_no: 1, answer: "Some long answer that is correct and should be truncated", is_correct: true, explanation: "Correct answer" },
              { ques_no: 2, answer: "Some long answer that is correct and should be truncated", is_correct: false, explanation: "Some explanation about why the selected answer is wrong and how the student can try to solve the question again with a hint." },
              { ques_no: 3, answer: "Some long answer that is correct and should be truncated", is_correct: true, explanation: "Correct answer" },
              { ques_no: 4, answer: "Some long answer that is correct and should be truncated", is_correct: false, explanation: "Some explanation about why the selected answer is wrong and how the student can try to solve the question again with a hint." },
              { ques_no: 5, answer: "Some long answer that is correct and should be truncated", is_correct: true, explanation: "Correct answer" },
              { ques_no: 6, answer: "Some long answer that is correct and should be truncated", is_correct: false, explanation: "Some explanation about why the selected answer is wrong and how the student can try to solve the question again with a hint." },
              { ques_no: 7, answer: "C", is_correct: true, explanation: "Correct answer" },
              { ques_no: 8, answer: "D", is_correct: false, explanation: "Some explanation about why the selected answer is wrong and how the student can try to solve the question again with a hint." },
              { ques_no: 9, answer: "A", is_correct: true, explanation: "Correct answer" },
              { ques_no: 10, answer: "B", is_correct: false, explanation: "Some explanation about why the selected answer is wrong and how the student can try to solve the question again with a hint." },
            ],
            score: 5,
            percent: 50,
            student_name: "Jintu Kumar Jhunnu",
            grade: 4,
            section: "A",
            subject: "Mathematics",
            date: new Date().toISOString(),
            out_of: 10,
            focus_areas: ["A learning objective that the student did not meet", "Another LO that the student did not meet"],
            insights: "The student struggled with multiple-choice questions and could not add large numbers. He also did not understand the commutative property of addition."
          },
        ],
      });
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
      <ScrollView className="flex-1 px-6 py-8 bg-white dark:bg-neutral-900">
        {/* Header Information */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <View className="flex-row items-center space-x-4">
              <Text className="text-2xl font-semibold text-gray-900 dark:text-white">
                Worksheet #{firstKey}
              </Text>
              <Text className="text-lg text-gray-500 dark:text-white">
                {formattedDate}
              </Text>
            </View>
            <Text className="self-start px-3 py-1 rounded-full bg-blue-400 text-white text-sm font-semibold mt-1 mb-6">
              {subject.toUpperCase()}
            </Text>
            <Text className="text-lg text-gray-900 dark:text-white">
              <Text className="text-gray-500">Student: </Text>
              {`${student_name}`}
            </Text>
            <Text className="text-lg text-gray-900 dark:text-white">
              <Text className="text-gray-500">Class: </Text>
              {`${grade}-${section}`}
            </Text>
          </View>

          <View className='items-center justify-center'>
            <View className="mx-4 mb-4">
              <CircularProgress
                value={percent}
                duration={1000}
                maxValue={100}
                radius={45}
                inActiveStrokeWidth={25}
                activeStrokeWidth={25}
                inActiveStrokeColor={'#2ecc71'}
                inActiveStrokeOpacity={0.2}
                progressValueColor={'#000'}
                title={'%'}
              />
            </View>
            <View className="flex-row items-center space-x-2">
              <Text className="text-5xl font-semibold text-gray-900 dark:text-white">
                {score}
              </Text>
              <View className="items-center justify-center">
                <Text className="text-md">out of</Text>
                <Text className="text-lg ">
                  {out_of}
                </Text>
              </View>

            </View>
          </View>
        </View>

        {/* Questions and Answers */}
        <View className="mt-2 mb-1">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Responses
          </Text>

          {answers.map((answer: any, index: number) => (
            <AnswerCard key={index} answer={answer} />
          ))}
        </View>

        <View className="mt-2 mb-1">
          {/* Focus Areas */}
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">
            Focus Areas
          </Text>
          {focus_areas.length > 0 ? (
            <FlatList
              data={focus_areas}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View className="bg-gray-100 dark:bg-neutral-800 px-4 py-3 rounded-lg mb-2">
                  <Text className="text-gray-800 dark:text-gray-200">
                    {item}
                  </Text>
                </View>
              )}
            />
          ) : (
            <Text className="text-gray-800 dark:text-gray-200">
              No focus areas identified.
            </Text>
          )}
        </View>


        <View className="mt-2 mb-1">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">
            Insights
          </Text>
          <Text className="text-gray-800 dark:text-gray-200 mb-2">
            {insights}
          </Text>
        </View>

        {/* Scan New Worksheet Button */}
        <View className="flex-1 items-center justify-center w-full mt-16 mb-4">
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

  const renderPictureList = () => {

    if (images.length === 0) {
      return renderCamera(); // Redirect to camera view if no images
    }

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
            renderItem={({ item, index }) => (
              <View className="relative w-36 h-36 mx-2 my-2">
                <Image
                  source={{ uri: item }}
                  resizeMode="contain"
                  className="w-full h-full rounded-lg shadow-md"
                />
                <TouchableOpacity
                  onPress={() => {
                    const newImages = [...images];
                    newImages.splice(index, 1);
                    setImages(newImages);
                  }}
                  className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1"
                >
                  <Text className="text-white text-xs font-bold"> × </Text>
                </TouchableOpacity>
              </View>
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