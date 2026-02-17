import React, { useState, useEffect } from "react";
import {
    View, Text, TouchableOpacity, Modal, TextInput, StyleSheet,
    KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ScrollView
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export const TABS = [
    { key: "activities", label: "กิจกรรม", color: "#6366f1", icon: "🎨" },
    { key: "study", label: "การเรียน", color: "#a855f7", icon: "📚" },
];

export const ACTIVITY_TYPES = ["ชมรม", "กีฬา", "อาสาสมัคร", "อื่นๆ"];

export const STUDY_PRIORITY = [
    { label: "ไม่เร่งด่วน", color: "#10b981" },
    { label: "ปานกลาง", color: "#f59e0b" },
    { label: "สำคัญมาก", color: "#ef4444" },
];

export const INITIAL_FORM = {
    title: "",
    subject: "",
    description: "",
    category: "",
    otherDetail: "",
    date: new Date(),
};

export default function PlannerFormModal({
    visible, onClose, activeTab, form, setForm, onSave, editingId
}) {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const currentTab = TABS.find((tab) => tab.key === activeTab);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString("th-TH", {
            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent statusBarTranslucent={true}
            navigationBarTranslucent={true}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    style={{ width: '100%', maxHeight: isKeyboardVisible ? '100%' : '90%' }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalBox}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{editingId ? 'แก้ไขข้อมูล' : `เพิ่ม${currentTab.label}`}</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Text style={{ fontSize: 24, color: '#94a3b8' }}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: isKeyboardVisible ? 150 : 20 }}
                                keyboardShouldPersistTaps="handled"
                            >
                                <TextInput
                                    placeholder="หัวข้อรายการ (เช่น ทำสรุป, ส่งงาน)..."
                                    style={styles.input}
                                    value={form.title}
                                    onChangeText={(t) => setForm((prev) => ({ ...prev, title: t }))}
                                />

                                {activeTab === "study" && (
                                    <TextInput
                                        placeholder="ชื่อวิชา (เช่น คณิตศาสตร์, ภาษาอังกฤษ)..."
                                        style={[styles.input, { borderLeftWidth: 4, borderLeftColor: currentTab.color }]}
                                        value={form.subject}
                                        onChangeText={(t) => setForm((prev) => ({ ...prev, subject: t }))}
                                    />
                                )}

                                <TextInput
                                    placeholder="รายละเอียดเพิ่มเติม (ระบุข้อมูลที่ต้องการบันทึก)..."
                                    style={[styles.input, styles.textArea]}
                                    value={form.description}
                                    onChangeText={(t) => setForm((prev) => ({ ...prev, description: t }))}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />

                                <Text style={styles.selectLabel}>{activeTab === "activities" ? "เลือกหมวดหมู่" : "ระดับความสำคัญ"}</Text>
                                <View style={styles.optionContainer}>
                                    {(activeTab === "activities"
                                        ? ACTIVITY_TYPES.map(a => ({ label: a, color: currentTab.color }))
                                        : STUDY_PRIORITY
                                    ).map((opt) => (
                                        <TouchableOpacity
                                            key={opt.label}
                                            onPress={() => setForm((prev) => ({ ...prev, category: opt.label }))}
                                            style={[styles.optionButton, form.category === opt.label && { backgroundColor: opt.color }]}
                                        >
                                            <Text style={[styles.optionText, form.category === opt.label && { color: "#fff" }]}>{opt.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {form.category === "อื่นๆ" && (
                                    <TextInput
                                        placeholder="ระบุรายละเอียดอื่นๆ..."
                                        style={[styles.input, { borderColor: currentTab.color, borderWidth: 1 }]}
                                        value={form.otherDetail}
                                        onChangeText={(t) => setForm((prev) => ({ ...prev, otherDetail: t }))}
                                    />
                                )}

                                <TouchableOpacity style={styles.datePickerBtn} onPress={() => setDatePickerVisibility(true)}>
                                    <View>
                                        <Text style={styles.datePickerLabel}>กำหนดวันเวลา</Text>
                                        <Text style={[styles.dateValue, { color: currentTab.color }]}>{formatDateTime(form.date)}</Text>
                                    </View>
                                    <Text style={{ fontSize: 22 }}>📅</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.btnSave, { backgroundColor: currentTab.color }]} onPress={onSave}>
                                    <Text style={styles.saveText}>บันทึกรายการ</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={(date) => {
                    setForm(prev => ({ ...prev, date }));
                    setDatePickerVisibility(false);
                    setTimeout(() => setTimePickerVisibility(true), 600);
                }}
                onCancel={() => setDatePickerVisibility(false)}
            />
            <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={(time) => {
                    const combined = new Date(form.date);
                    combined.setHours(time.getHours(), time.getMinutes());
                    setForm(prev => ({ ...prev, date: combined }));
                    setTimePickerVisibility(false);
                }}
                onCancel={() => setTimePickerVisibility(false)}
            />
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.6)", justifyContent: "flex-end" },
    modalBox: { width: "100%", maxHeight: "100%", backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: "800", color: '#1e293b' },
    input: { backgroundColor: "#F1F5F9", padding: 16, borderRadius: 12, marginBottom: 12, fontSize: 16 },
    textArea: { height: 80, fontSize: 14 },
    selectLabel: { fontWeight: "700", marginBottom: 10, color: '#475569', fontSize: 14 },
    optionContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
    optionButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#F1F5F9' },
    optionText: { color: '#64748b', fontWeight: '700', fontSize: 13 },
    datePickerBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#F1F5F9', borderRadius: 12, marginBottom: 25 },
    datePickerLabel: { fontSize: 12, color: '#64748b', fontWeight: '600' },
    dateValue: { fontWeight: '700', fontSize: 15 },
    btnSave: { padding: 16, borderRadius: 12, alignItems: "center" },
    saveText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});