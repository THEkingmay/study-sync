import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import Navbar from "../components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../contexts/DataProvider";

export default function ProfileScreen() {
  const { profileData, setProfileData, resetAllData } = useData();

  const handleSave = () => {
    if (
      !profileData.fullname ||
      !profileData.studentId ||
      !profileData.faculty ||
      !profileData.year
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    alert("บันทึกข้อมูลสำเร็จ");
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#6C63FF" />
            </View>
            <Text style={styles.headerTitle}>ข้อมูลส่วนตัว</Text>
            <Text style={styles.headerSubtitle}>จัดการข้อมูลนิสิตของคุณ</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>ชื่อ-นามสกุล</Text>
            <TextInput
              placeholder="เช่น นายเขียว ขาว"
              placeholderTextColor="#A0A0A0"
              style={styles.input}
              value={profileData.fullname}
              onChangeText={(text) =>
                setProfileData(prev => ({ ...prev, fullname: text }))
              }
            />

            <Text style={styles.label}>รหัสนักศึกษา</Text>
            <TextInput
              placeholder="เช่น 6621600183"
              placeholderTextColor="#A0A0A0"
              style={styles.input}
              keyboardType="numeric"
              value={profileData.studentId}
              onChangeText={(text) =>
                setProfileData(prev => ({ ...prev, studentId: text }))
              } />

            <Text style={styles.label}>คณะ/สาขา</Text>
            <TextInput
              placeholder="เช่น เทคโนโลยีสารสนเทศ"
              placeholderTextColor="#A0A0A0"
              style={styles.input}
              value={profileData.faculty}
              onChangeText={(text) =>
                setProfileData(prev => ({ ...prev, faculty: text }))
              }
            />

            <Text style={styles.label}>ชั้นปี</Text>
            <TextInput
              placeholder="เช่น 1, 2, 3, 4"
              placeholderTextColor="#A0A0A0"
              style={styles.input}
              keyboardType="numeric"
              value={profileData.year}
              onChangeText={(text) =>
                setProfileData(prev => ({ ...prev, year: text }))
              }
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>บันทึกข้อมูล</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                Alert.alert(
                  "Reset แอปทั้งหมด",
                  "ข้อมูลทุกหน้าจะถูกลบทั้งหมด",
                  [
                    { text: "ยกเลิก", style: "cancel" },
                    {
                      text: "ลบทั้งหมด",
                      style: "destructive",
                      onPress: resetAllData
                    }
                  ]
                );
              }}
            >
              <Text style={styles.resetText}>ลบข้อมูลทั้งหมด (Reset App)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#E8E6FF",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#EAECEF",
  },
  button: {
    backgroundColor: "#6C63FF",
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  resetButton: {
    marginTop: 16,
    backgroundColor: "#ff4d4d",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  resetText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});