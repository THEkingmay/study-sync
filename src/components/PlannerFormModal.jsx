import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { ACTIVITY_TYPES, STUDY_PRIORITY } from "../screens/Planner";

export default function PlannerFormModal({
    visible,
    onClose,
    activeTab,
    form,
    setForm,
    onSave,
    editingId
}) {
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const categories =
        activeTab === "activities"
            ? ACTIVITY_TYPES
            : STUDY_PRIORITY.map((p) => p.label);

    const formatTime = (date) => {
        const h = date.getHours().toString().padStart(2, "0");
        const m = date.getMinutes().toString().padStart(2, "0");
        return `${h}:${m}`;
    };
    const formatDate = (date) => {
        return date.toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>
                            {editingId ? "แก้ไขรายการ" : "เพิ่มกิจกรรม"}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="หัวข้อรายการ"
                            value={form.title}
                            onChangeText={(text) => setForm({ ...form, title: text })}
                        />

                        <TextInput
                            style={[styles.input, { height: 80 }]}
                            placeholder="รายละเอียดเพิ่มเติม"
                            multiline
                            value={form.description}
                            onChangeText={(text) => setForm({ ...form, description: text })}
                        />

                        <Text style={styles.sectionTitle}>เลือกหมวดหมู่</Text>
                        <View style={styles.categoryContainer}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryBtn,
                                        form.category === cat && styles.categoryActive
                                    ]}
                                    onPress={() => setForm({ ...form, category: cat })}
                                >
                                    <Text>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.sectionTitle}>เลือกวันที่</Text>

                        <TouchableOpacity
                            style={styles.timeBtn}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text>
                                📅 {form.date ? formatDate(new Date(form.date)) : "เลือกวันที่"}
                            </Text>
                        </TouchableOpacity>
                        {/* 🔥 TIME PICKER SECTION */}
                        <Text style={styles.sectionTitle}>กำหนดเวลา</Text>

                        <TouchableOpacity
                            style={styles.timeBtn}
                            onPress={() => setShowStartPicker(true)}
                        >
                            <Text>
                                เวลาเริ่ม: {form.startTime || "เลือกเวลา"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.timeBtn}
                            onPress={() => setShowEndPicker(true)}
                        >
                            <Text>
                                เวลาสิ้นสุด: {form.endTime || "เลือกเวลา"}
                            </Text>
                        </TouchableOpacity>

                        {showStartPicker && (
                            <DateTimePicker
                                value={new Date()}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowStartPicker(false);
                                    if (selectedDate) {
                                        setForm({
                                            ...form,
                                            startTime: formatTime(selectedDate)
                                        });
                                    }
                                }}
                            />
                        )}

                        {showEndPicker && (
                            <DateTimePicker
                                value={new Date()}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowEndPicker(false);
                                    if (selectedDate) {
                                        setForm({
                                            ...form,
                                            endTime: formatTime(selectedDate)
                                        });
                                    }
                                }}
                            />
                        )}

                        {showDatePicker && (
                            <DateTimePicker
                                value={form.date ? new Date(form.date) : new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        setForm({
                                            ...form,
                                            date: selectedDate
                                        });
                                    }
                                }}
                            />
                        )}

                        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
                            <Text style={styles.saveText}>บันทึกรายการ</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancel}>ยกเลิก</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end"
    },
    container: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: "90%"
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    input: {
        backgroundColor: "#f1f5f9",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12
    },
    sectionTitle: {
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 8
    },
    categoryContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 10
    },
    categoryBtn: {
        backgroundColor: "#e2e8f0",
        padding: 8,
        borderRadius: 10,
        marginRight: 8,
        marginBottom: 8
    },
    categoryActive: {
        backgroundColor: "#c7d2fe"
    },
    timeBtn: {
        backgroundColor: "#f1f5f9",
        padding: 14,
        borderRadius: 12,
        marginBottom: 10
    },
    saveBtn: {
        backgroundColor: "#6366f1",
        padding: 15,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 10
    },
    saveText: {
        color: "#fff",
        fontWeight: "bold"
    },
    cancel: {
        textAlign: "center",
        marginTop: 10,
        color: "#64748b"
    }
});