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

  const autoGrade = async () => {
    if (images.length === 0) {
      Alert.alert("No images", "Please take at least one picture before auto-grading.");
      return;
    }

    setIsGrading(true);
    try {
      const uploadImages = async () => {
        const formData = new FormData();
        // Loop through the images and append them to the FormData object
        images.forEach((image, index) => {
          formData.append('images[]', {
            uri: image.uri, // URI of the image file
            type: 'image/jpeg', // MIME type of the image (adjust accordingly)
            name: `image_${index + 1}.jpg`, // Give a unique name to each file
          });
        });
      }
      // // Replace with your API endpoint URL
      // const response = await axios.post('https://your-api-endpoint.com/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data', // Important for sending files
      //   },
      // });

      // setUploadStatus('Upload successful!');

      const result = {
        score: 70, // Numeric score representing the performance, typically out of 100
        questions: [
          { questionId: 1, text: 'abcd', correct: true, answer: "B" },
          { questionId: 2, text: 'abcd', correct: false, answer: "A" },
          { questionId: 3, text: 'abcd', correct: true, answer: "C" },
          { questionId: 4, text: 'abcd', correct: true, answer: "D" }
        ],
        insights: [
          "Review the concepts of mathematical proofs",
          "Focus more on problem-solving under time pressure"
        ]
      };
      setGradingResult(result);
      // console.log(response.data);
    } catch (error) {
      // setUploadStatus('Upload failed!');
      console.error(error);
    } finally {
      setIsGrading(false);
    }
  };

  const renderGradingResult = () => {
    if (!gradingResult) return null;

    const { score, questions, insights } = gradingResult;
    const { width } = Dimensions.get('window');
    const chartWidth = width - 64; // Adjust for padding
    const chartHeight = 150; // Set a fixed height for the chart

    // Mock data for the last 5 scores
    const lastFiveScores = [65, 70, 75, 80, score]; // Replace with actual data if available
    const data = {
      labels: ['1', '2', '3', '4', '5'], // Adjust labels if needed
      datasets: [
        {
          data: lastFiveScores, // The data for the line chart (lastFiveScores is expected to be an array of numbers)
          strokeWidth: 2, // Line thickness
        },
      ],
    };


    return (
      <ScrollView className="flex-1 px-6 py-8 bg-white dark:bg-neutral-900">
        <Text className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
          Worksheet #61 - Science (Grade 5)
        </Text>
        <Text className="text-md font-semibold text-gray-900 dark:text-white mb-2">
          Chintu C. - Class 5A
        </Text>
        <Text className="text-md font-semibold text-gray-900 dark:text-white mb-2">
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        {/* Circular Percent Gauge */}
        <View className="items-center mb-6">
          <ProgressCircle
            progress={score / 100}
            size={100}
            thickness={12}
            color="#4CAF50"
            unfilledColor="#E0E0E0"
            showsText={true}
            textStyle={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#FFF',
            }}
            formatText={() => `${score}%`}
          />
        </View>

        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Last 5 Science Worksheets
        </Text>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>

          <LineChart
            data={data} // Use the data structured as per the react-native-chart-kit API
            width={chartWidth} // Set the width dynamically based on screen size
            height={chartHeight} // Set the height of the chart
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0, // Optional: for decimal places in data
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Line color (green)
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
              propsForLabels: {
                fontSize: 12, // Set font size for axis labels
                fontWeight: '500', // Use medium weight for labels
              },
              style: {
                borderRadius: 16,
                paddingVertical: 32, // Add more padding for the chart container
              },
              gridLines: {
                drawBorder: false, // Disable border around the chart
                color: '#d3d3d3', // Lighter grid color for better contrast
              },
              propsForDots: {
                r: '4', // Dot radius for the data points
                strokeWidth: '2', // Stroke width for the dots
                stroke: '#4CAF50', // Dot color
              },
            }}
            bezier // Optional: adds a smooth curve to the line chart
            style={{
              marginVertical: 16,
              paddingVertical: 24,
              borderRadius: 16,
              backgroundColor: '#fff', // Set background color for the chart container
              elevation: 5, // Adds shadow for better separation from background
            }}
          />
        </View>

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
              name={question.correct ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={question.correct ? 'green' : 'red'}
            />
          </View>
        ))}

        <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">
          Insights
        </Text>
        {insights.map((insight: any, index: number) => (
          <View
            key={index}
            className="flex-row justify-between items-center bg-gray-100 dark:bg-neutral-800 px-4 py-3 rounded-lg mb-2"
          >
            <Text className="text-gray-800 dark:text-gray-200">{insight}</Text>
          </View>
        ))}
        <View className="flex-1 items-center justify-center w-full">
          <View className="flex-1 items-center justify-center w-72 mb-16 mt-8 py-4">
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