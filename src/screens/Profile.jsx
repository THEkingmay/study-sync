import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ข้อมูลส่วนตัว</Text>

        <Text style={styles.label}>ชื่อ-นามสกุล</Text>
        <TextInput placeholder="เช่น นายเขียว ขาว" style={styles.input} />

        <Text style={styles.label}>รหัสนักศึกษา</Text>
        <TextInput
          placeholder="เช่น 6621600183"
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.label}>คณะ/สาขา</Text>
        <TextInput placeholder="เช่น เทคโนโลยีสารสนเทศ" style={styles.input} />

        <Text style={styles.label}>ชั้นปี</Text>
        <TextInput
          placeholder="เช่น 1,2,3,4"
          style={styles.input}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>บันทึกข้อมูล</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EBDDE2",
    padding: 20,
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },

  cardTitle: {
    backgroundColor: "#BDB4B4",
    padding: 10,
    borderRadius: 12,
    fontWeight: "600",
    marginBottom: 15,
  },

  label: {
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#DADADA",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  button: {
    backgroundColor: "#6C63FF",
    marginTop: 20,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
